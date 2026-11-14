"""
Admin Account & Password Management Utility for Mehndi By Dhirali.
Allows securely resetting passwords, listing admin accounts, or creating new administrators
across Local SQLite and Production Neon PostgreSQL databases.
"""
import sys
import os
import argparse
import getpass
from pathlib import Path
from dotenv import load_dotenv

# Ensure backend root is on Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

# Load environment variables (.env)
load_dotenv(BACKEND_DIR / ".env")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.security import hash_password, verify_password


def get_databases(target_choice: str = "all"):
    """Returns database connection URLs to operate upon."""
    sqlite_url = f"sqlite:///{BACKEND_DIR}/mehndi_dev.db"
    neon_url = os.getenv("DATABASE_URL")

    dbs = []
    if target_choice in ["all", "local", "sqlite"]:
        dbs.append(("Local SQLite", sqlite_url))
    if target_choice in ["all", "neon", "prod", "production"]:
        if neon_url and not neon_url.startswith("sqlite"):
            dbs.append(("Production Neon PostgreSQL", neon_url))
        elif target_choice in ["neon", "prod", "production"]:
            print("[WARN] DATABASE_URL in .env is not a PostgreSQL URL.")

    return dbs


def list_admins(dbs):
    """Lists existing administrators across databases."""
    for label, url in dbs:
        print(f"\n--- {label} ---")
        try:
            connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
            engine = create_engine(url, connect_args=connect_args, pool_pre_ping=True)
            Session = sessionmaker(bind=engine)
            db = Session()
            admins = db.query(User).filter(User.role == "admin").all()
            if not admins:
                print("  No administrators found.")
            for a in admins:
                status = "Active" if a.is_active else "Inactive"
                print(f"  • Email: {a.email:<35} | Name: {a.first_name} {a.last_name or ''} | Status: {status}")
            db.close()
        except Exception as e:
            print(f"  [ERROR] Could not connect to {label}: {e}")


def reset_or_create_admin(email: str, password: str, dbs, first_name="Admin", last_name="Dhirali"):
    """Securely hashes the password and upserts the admin user in target databases."""
    email = email.lower().strip()
    hashed_pw = hash_password(password)

    # Sanity check
    if not verify_password(password, hashed_pw):
        print("[ERROR] Internal error: Hashed password verification failed.")
        return False

    success_all = True
    for label, url in dbs:
        print(f"\nUpdating {label}...")
        try:
            connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
            engine = create_engine(url, connect_args=connect_args, pool_pre_ping=True)
            Session = sessionmaker(bind=engine)
            db = Session()

            user = db.query(User).filter(User.email == email).first()
            if user:
                user.password_hash = hashed_pw
                user.role = "admin"
                user.is_active = True
                db.commit()
                print(f"  [OK] Password and admin role successfully updated for: {email}")
            else:
                new_user = User(
                    email=email,
                    password_hash=hashed_pw,
                    first_name=first_name,
                    last_name=last_name,
                    phone="+919876543210",
                    role="admin",
                    is_active=True,
                )
                db.add(new_user)
                db.commit()
                print(f"  [OK] New administrator created: {email} (role: admin)")

            # Verify
            saved = db.query(User).filter(User.email == email).first()
            if saved and verify_password(password, saved.password_hash) and saved.role == "admin":
                print(f"  [VERIFIED] Password check and admin authorization confirmed on {label}.")
            else:
                print(f"  [WARN] Verification check did not confirm match on {label}.")
                success_all = False

            db.close()
        except Exception as e:
            print(f"  [ERROR] Failed to update {label}: {e}")
            success_all = False

    return success_all


def main():
    parser = argparse.ArgumentParser(description="Manage Admin Users & Passwords for Mehndi By Dhirali")
    parser.add_argument("--list", action="store_true", help="List all administrator accounts")
    parser.add_argument("--email", type=str, help="Admin email address")
    parser.add_argument("--password", type=str, help="New password for the admin user")
    parser.add_argument(
        "--target",
        type=str,
        default="all",
        choices=["all", "local", "neon", "sqlite", "prod"],
        help="Target database (default: all)",
    )

    args = parser.parse_args()
    dbs = get_databases(args.target)

    if args.list:
        list_admins(dbs)
        return

    email = args.email
    password = args.password

    # Interactive mode if arguments are missing
    if not email:
        email = input("Enter Admin Email address: ").strip()

    if not password:
        password = getpass.getpass("Enter New Admin Password: ")
        confirm_pw = getpass.getpass("Confirm New Admin Password: ")
        if password != confirm_pw:
            print("[ERROR] Passwords do not match. Aborting.")
            sys.exit(1)

    if not email or not password:
        print("[ERROR] Both email and password are required.")
        sys.exit(1)

    print(f"\nProcessing password update for '{email}' across target databases...")
    ok = reset_or_create_admin(email, password, dbs)
    if ok:
        print("\nAll database updates completed successfully!")
    else:
        print("\nCompleted with one or more errors. Please check the logs above.")


if __name__ == "__main__":
    main()
