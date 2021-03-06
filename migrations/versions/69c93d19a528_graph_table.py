"""graph table

Revision ID: 69c93d19a528
Revises: d85aad9b2d66
Create Date: 2019-05-20 00:57:55.638090

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '69c93d19a528'
down_revision = 'd85aad9b2d66'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('graph',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=64), nullable=True),
    sa.Column('body', sa.Text(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('graph')
    # ### end Alembic commands ###
