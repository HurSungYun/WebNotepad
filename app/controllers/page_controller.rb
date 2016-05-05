class PageController < ApplicationController
  def index
    @notes = Note.all
  end
end
