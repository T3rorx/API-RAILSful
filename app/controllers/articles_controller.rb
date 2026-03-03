class ArticlesController < ApplicationController
  before_action :set_article, only: %i[ show update destroy ]
  before_action :authenticate_user!, only: %i[ create update destroy ]
  before_action :authorize_owner!, only: %i[ update destroy ]

  # GET /articles
  def index
    @articles = Article.visible_to(current_user)

    render json: @articles
  end

  # GET /articles/1
  def show
    if @article.is_private? && @article.user_id != current_user&.id
      head :not_found
      return
    end
    render json: @article
  end

  # POST /articles
  def create
    @article = current_user.articles.build(article_params)

    if @article.save
      render json: @article, status: :created, location: @article
    else
      render json: @article.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /articles/1
  def update
    if @article.update(article_params)
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_content
    end
  end

  # DELETE /articles/1
  def destroy
    @article.destroy!
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def authorize_owner!
    head :forbidden unless @article.user_id == current_user&.id
  end

  def article_params
    params.expect(article: [ :title, :content, :is_private ])
  end
end
