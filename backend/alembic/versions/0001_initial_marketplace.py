"""initial marketplace schema

Revision ID: 0001_initial_marketplace
Revises:
Create Date: 2026-07-10
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial_marketplace"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    role = sa.Enum("guest", "host", "admin", name="user_role")
    role.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("phone", sa.String(length=40)),
        sa.Column("avatar", sa.String(length=500)),
        sa.Column("role", role, nullable=False),
        sa.Column("verified", sa.Boolean(), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("two_factor_enabled", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table(
        "properties",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(length=180), nullable=False),
        sa.Column("slug", sa.String(length=220), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("property_type", sa.String(length=80), nullable=False),
        sa.Column("bedrooms", sa.Integer(), nullable=False),
        sa.Column("bathrooms", sa.Integer(), nullable=False),
        sa.Column("guests", sa.Integer(), nullable=False),
        sa.Column("price_per_night", sa.Numeric(10, 2), nullable=False),
        sa.Column("cleaning_fee", sa.Numeric(10, 2), nullable=False),
        sa.Column("service_fee", sa.Numeric(10, 2), nullable=False),
        sa.Column("location", sa.String(length=180), nullable=False),
        sa.Column("latitude", sa.Float()),
        sa.Column("longitude", sa.Float()),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )
    op.create_index("ix_properties_slug", "properties", ["slug"])
    op.create_table(
        "property_images",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("property_id", sa.Integer(), sa.ForeignKey("properties.id"), nullable=False),
        sa.Column("image_url", sa.String(length=800), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False)
    )
    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("guest_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("property_id", sa.Integer(), sa.ForeignKey("properties.id"), nullable=False),
        sa.Column("check_in", sa.Date(), nullable=False),
        sa.Column("check_out", sa.Date(), nullable=False),
        sa.Column("total_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("booking_status", sa.String(length=40), nullable=False),
        sa.Column("payment_status", sa.String(length=40), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("property_id", sa.Integer(), sa.ForeignKey("properties.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )
    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("sender_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("receiver_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("booking_id", sa.Integer(), sa.ForeignKey("bookings.id")),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )
    op.create_table(
        "wishlist",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("property_id", sa.Integer(), sa.ForeignKey("properties.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("read_status", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False)
    )


def downgrade() -> None:
    for table in ["notifications", "wishlist", "messages", "reviews", "bookings", "property_images", "properties", "users"]:
        op.drop_table(table)
    sa.Enum(name="user_role").drop(op.get_bind(), checkfirst=True)
