"""sync_order_tracking_and_catalogue

Revision ID: e71b29fa1024
Revises: bca34b7fe2d5
Create Date: 2026-10-30 15:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e71b29fa1024'
down_revision: Union[str, Sequence[str], None] = 'bca34b7fe2d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Migration handles existing or newly created tracking and COD columns idempotently
    bind = op.get_bind()
    insp = sa.inspect(bind)
    
    if "orders" in insp.get_table_names():
        existing_cols = [c["name"] for c in insp.get_columns("orders")]
        new_cols = [
            ("tracking_number", sa.String(100), True),
            ("courier_partner", sa.String(100), True),
            ("tracking_url", sa.String(500), True),
            ("estimated_delivery", sa.String(100), True),
            ("shipped_at", sa.DateTime(timezone=True), True),
            ("delivered_at", sa.DateTime(timezone=True), True),
            ("tracking_notes", sa.Text(), True),
            ("payment_method", sa.String(30), True),
            ("cod_fee_minor", sa.Integer(), True),
        ]
        for col_name, col_type, nullable in new_cols:
            if col_name not in existing_cols:
                op.add_column("orders", sa.Column(col_name, col_type, nullable=nullable))


def downgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)
    if "orders" in insp.get_table_names():
        existing_cols = [c["name"] for c in insp.get_columns("orders")]
        cols_to_drop = [
            "tracking_number",
            "courier_partner",
            "tracking_url",
            "estimated_delivery",
            "shipped_at",
            "delivered_at",
            "tracking_notes",
            "payment_method",
            "cod_fee_minor",
        ]
        for col_name in cols_to_drop:
            if col_name in existing_cols:
                op.drop_column("orders", col_name)
