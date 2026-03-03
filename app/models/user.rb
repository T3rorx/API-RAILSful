class User < ApplicationRecord
  has_many :articles, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :photos, dependent: :destroy

  validates :email, presence: true

  devise :database_authenticatable, :registerable,
         :validatable, :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist
end
