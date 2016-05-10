class PageController < ApplicationController
  def index
    if params[:note] != nil
      # render :json i=> { note: params[:note], label: params[:label] }
      @note = params[:note]
      @label = params[:label]
    end
  end

end
