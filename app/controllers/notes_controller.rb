class NotesController < ApplicationController
require 'json'



def create
  if (params[:subject].length != 0 && params[:subject].length < 45) || params[:subject] == nil
    @note = Note.new(subject: params[:subject])
    @note.content = params[:content]
 
    if @note.save
      render :json => { subject: @note.subject, content: @note.content, updatedAt: @note.created_at.to_formatted_s(:rfc822), eid: @note.id}
    end
  else
    render :json => { eid: -1 }
  end
end

def read
  @notes = Note.all
  @json = []
  @notes.each do |note| 
    @json << {subject: note.subject, content: note.content, updatedAt: note.updated_at.to_formatted_s(:rfc822), eid: note.id}
  end

  render :json => @json.to_json
end

def update
  if (params[:subject].length != 0 && params[:subject].length < 45) || params[:subject] == nil
    @note = Note.find(params[:id])

    @note.subject = params[:subject]
    @note.content = params[:content]
  
    if @note.save
      render :json => { subject: @note.subject, content: @note.content, updatedAt: @note.updated_at.to_formatted_s(:rfc822), eid: @note.id}
    end
  else
    render :json => { eid: -1 }
  end

end

def delete
  @note = Note.find(params[:id])
  temp = @note.id
  
  @labels = Label.all

  @labels.each do |label|
    if label.notes.find_by(id: temp) != nil
      @pNote = Note.find(temp)
      label.notes.delete(@pNote)
      label.item = label.item - 1 
      label.save
    end
  end

  if @note.destroy
    render :json => {eid: temp}
  end
end

end
