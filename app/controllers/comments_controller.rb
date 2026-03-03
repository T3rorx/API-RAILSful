# frozen_string_literal: true

class CommentsController < ApplicationController
  before_action :set_article
  before_action :set_comment, only: %i[ show update destroy ]
  before_action :authenticate_user!, only: %i[ create update destroy ]
  before_action :authorize_comment_owner!, only: %i[ update destroy ]

  # GET /articles/:article_id/comments
  def index
    @comments = @article.comments
    render json: @comments
  end

  # GET /articles/:article_id/comments/:id
  def show
    render json: @comment
  end

  # POST /articles/:article_id/comments
  def create
    @comment = @article.comments.build(comment_params)
    @comment.user = current_user

    if @comment.save
      render json: @comment, status: :created, location: article_comment_url(@article, @comment)
    else
      render json: @comment.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /articles/:article_id/comments/:id
  def update
    if @comment.update(comment_params)
      render json: @comment
    else
      render json: @comment.errors, status: :unprocessable_content
    end
  end

  # DELETE /articles/:article_id/comments/:id
  def destroy
    @comment.destroy!
  end

  private

  def set_article
    @article = Article.find(params[:article_id])
    if @article.is_private? && @article.user_id != current_user&.id
      head :not_found
    end
  end

  def set_comment
    @comment = @article.comments.find(params[:id])
  end

  def authorize_comment_owner!
    head :forbidden unless @comment.user_id == current_user&.id
  end

  def comment_params
    params.expect(comment: [ :body ])
  end
end
