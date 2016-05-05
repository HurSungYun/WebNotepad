class NotesController < ApplicationController
require 'json'

def create
  @note = Note.new(subject: params[:subject])
  @note.content = params[:content]
  
  if @note.save
    render :json => { "subject": @note.subject, "content": @note.content, "eid": @note.id }
  end
end

def read
  @notes = Note.all
  @json = []
  @notes.each do |note| 
    @json << {subject: note.subject, content: note.content, eid: note.id}
  end

  render :json => @json.to_json
end

def update
end

def delete
end

def add_label
end

def remove_label
end

end
