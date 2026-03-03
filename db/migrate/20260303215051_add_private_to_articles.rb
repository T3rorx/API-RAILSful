class AddPrivateToArticles < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :is_private, :boolean, default: false, null: false
  end
end
