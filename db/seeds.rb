# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Article.destroy_all
User.destroy_all

# Create a few users for development
users = []
3.times do |i|
  users << User.create!(
    email: "user#{i + 1}@example.com",
    password: "password123",
    password_confirmation: "password123"
  )
end

# Create ~30 articles with Faker, assigned to users
30.times do
  Article.create!(
    title: Faker::Lorem.sentence(word_count: 3),
    content: Faker::Lorem.paragraph(sentence_count: 5),
    user: users.sample
  )
end
