# frozen_string_literal: true

class PhotosController < ApplicationController
  before_action :set_photo, only: %i[ show update destroy ]
  before_action :authenticate_user!, only: %i[ create update destroy ]
  before_action :authorize_photo_owner!, only: %i[ update destroy ]

  # GET /photos
  def index
    @photos = Photo.all
    render json: @photos
  end

  # GET /photos/1
  def show
    render json: @photo
  end

  # POST /photos
  def create
    @photo = current_user.photos.build(photo_params)

    if @photo.save
      render json: @photo.as_json(methods: [:image_url]), status: :created, location: @photo
    else
      render json: @photo.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /photos/1
  def update
    if @photo.update(photo_params)
      render json: @photo
    else
      render json: @photo.errors, status: :unprocessable_content
    end
  end

  # DELETE /photos/1
  def destroy
    @photo.destroy!
  end

  # GET /latest - last photo with image_url (for bonus monolith frontend)
  def latest
    @photo = Photo.last
    if @photo
      render json: { id: @photo.id, image_url: @photo.image_url }
    else
      render json: {}
    end
  end

  private

  def set_photo
    @photo = Photo.find(params[:id])
  end

  def authorize_photo_owner!
    head :forbidden unless @photo.user_id == current_user&.id
  end

  def photo_params
    params.expect(photo: [ :image ])
  end
end
