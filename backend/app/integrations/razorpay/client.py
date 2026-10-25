"""
Razorpay Payment Gateway client integration.
Operates server-authoritatively using official Razorpay verification algorithms.
"""
import hmac
import hashlib
from typing import Dict, Any, Optional
import structlog
from app.core.config import settings

logger = structlog.get_logger(__name__)


class RazorpayClient:
    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET
        self.webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

    def create_order(
        self,
        amount_minor: int,
        currency: str = "INR",
        receipt: Optional[str] = None,
        notes: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Creates an authorized Razorpay order on the payment provider server.
        Amount must be in integer minor units (paise).
        """
        # If in placeholder or simulation test mode, return deterministic mock order
        if (
            self.key_id.startswith("rzp_test_placeholder")
            or "placeholder" in self.key_secret
            or "paste_your" in self.key_id
            or "paste_your" in self.key_secret
        ):
            logger.info("Using simulated Razorpay order for development/testing", amount=amount_minor)
            return {
                "id": f"order_mock_{receipt or 'mbd'}_{amount_minor}",
                "amount": amount_minor,
                "currency": currency,
                "receipt": receipt,
                "status": "created",
            }

        try:
            import razorpay
            client = razorpay.Client(auth=(self.key_id, self.key_secret))
            payload = {
                "amount": amount_minor,
                "currency": currency,
                "receipt": receipt or "",
                "notes": notes or {},
            }
            order = client.order.create(data=payload)
            return order
        except Exception as e:
            logger.error("Failed to create Razorpay order", error=str(e))
            raise RuntimeError(f"Payment gateway order creation failed: {str(e)}")

    def verify_payment_signature(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> bool:
        """
        Verifies the authenticity of Razorpay payment signature using HMAC SHA256.
        Official algorithm: HMAC-SHA256(order_id + "|" + payment_id, secret) == signature
        """
        if (
            self.key_id.startswith("rzp_test_placeholder")
            or "placeholder" in self.key_secret
            or "paste_your" in self.key_id
            or "paste_your" in self.key_secret
        ):
            # Allow simulation mode in local dev testing
            logger.info("Simulation mode: verified payment signature for mock order", payment_id=razorpay_payment_id)
            return True

        try:
            message = f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8")
            expected_signature = hmac.new(
                self.key_secret.encode("utf-8"),
                message,
                hashlib.sha256,
            ).hexdigest()

            return hmac.compare_digest(expected_signature, razorpay_signature)
        except Exception as e:
            logger.error("Signature verification error", error=str(e))
            return False

    def verify_webhook_signature(
        self,
        raw_body: bytes,
        signature_header: str,
    ) -> bool:
        """
        Verifies Razorpay Webhook signature using configured webhook secret.
        """
        if not self.webhook_secret or self.webhook_secret == "placeholder_webhook_secret":
            logger.warning("Webhook received with placeholder secret; allowing in test mode.")
            return True

        try:
            expected_signature = hmac.new(
                self.webhook_secret.encode("utf-8"),
                raw_body,
                hashlib.sha256,
            ).hexdigest()

            return hmac.compare_digest(expected_signature, signature_header)
        except Exception as e:
            logger.error("Webhook signature verification exception", error=str(e))
            return False


razorpay_client = RazorpayClient()
