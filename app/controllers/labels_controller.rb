class LabelsController < ApplicationController

def create
  @label = Label.new
  @label.subject = params[:name]
  @label.item = 0

  if @label.save
    render :json => {name: @label.subject, item: @label.item, eid: @label.id }
  end
end


def read
  @labels = Label.all
  @json = []
  @labels.each do |label|
    @json << {name: label.subject, item: label.item, eid: label.id}
  end

  render :json => @json.to_json
end

def show
  @label = Label.find(params[:id])
  @json = []
  @label.notes.each do |note|
    @json << {subject: note.subject, content: note.content, eid: note.eid}
  end
end


def delete
  @label = Label.find(params[:id])
  temp = @label.id
  if @label.destroy
    render :json => {"eid": temp}
  end
end

def tagLabel
  @label = Label.find(params[:id])
  temp = @label.item
  
  params[:list].each do |note_id|
    pNote = Note.find(note_id)
    @label.notes = @label.notes.push(pNote)
    temp = temp + 1
  end

  @label.item = temp

  if @label.save
    render :json => {item: temp, eid: @label.id}
  end
end

def untagLabel

end

end
