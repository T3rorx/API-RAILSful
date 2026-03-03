class Article < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments, dependent: :destroy

  validates :title, :content, presence: true

  scope :visible_to, ->(user) {
    if user
      where(is_private: false).or(where(user_id: user.id))
    else
      where(is_private: false)
    end
  }
end
