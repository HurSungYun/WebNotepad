class LabelsController < ApplicationController

def create

  if Label.find_by(subject: params[:name]) != nil
    render :json => {eid: -2}
  elsif (params[:name].length != 0 && params[:name].length < 15) || params[:name] == nil
    @label = Label.new
    @label.subject = params[:name]
    @label.item = 0

    if @label.save
      render :json => {name: @label.subject, item: @label.item, eid: @label.id, notes: [] }
    end
  else
    render :json => {eid: -1}
  end
end

def update
  if Label.find_by(subject: params[:name]) != nil
    render :json => {eid: -2}
  elsif (params[:name].length != 0 && params[:name].length < 15) || params[:name] == nil
    @label = Label.find(params[:id])
    @label.subject = params[:name]
    if @label.save
      render :json => {name: @label.subject , eid: @label.id}
    end
  else
    render :json => {eid: -1}
  end
end

def read
  @labels = Label.all
  @json = []
  @labels.each do |label|
    @note_json = []
    if label.notes != nil
      label.notes.each do |note|
        @note_json << { eid: note.id }
      end
    else
      @note_json << []
    end
    @json << {name: label.subject, item: label.item, eid: label.id, notes: @note_json}
  end

  render :json => @json.to_json
end

def show
  @label = Label.find(params[:id])
  @json = []
  @label.notes.each do |note|
    @json << {subject: note.subject, content: note.content, eid: note.id}
  end

  render :json => @json.to_json
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
  count = 0

  if params[:list] != nil
  
    params[:list].each do |note_id|
      pNote = Note.find(note_id)
      if @label.note_ids.index(note_id) == nil
        @label.notes.push(pNote)
        temp = temp + 1
        count = count + 1
      end
    end

    @note_json = []
    @label.item = temp

    if @label.notes != nil
      @label.notes.each do |note|
        @note_json << { eid: note.id }
      end
    else
      @note_json << []
    end

    if @label.save
      render :json => {item: temp, eid: @label.id, notes: @note_json}
    end
  else
     if @label.notes != nil
        @note_json = []
        @label.notes.each do |note|
          @note_json << { eid: note.id }
        end
     else
       @note_json = []
     end
        render :json => {item: @label.item, eid: @label.id, notes: @note_json}
  end
end

def untagLabel
  @label = Label.find(params[:id])
  
  temp = @label.item

  if params[:list] != nil
    params[:list].each do |note_id|
      pNote = Note.find(note_id)
      if @label.note_ids.index(note_id) != nil
        @label.notes.delete(pNote)
        temp = temp - 1
      end
    end

    @note_json = []
    @label.item = temp

    if @label.notes != nil
      @label.notes.each do |note|
        @note_json << { eid: note.id }
      end
    else
      @note_json << []
    end
  
    if @label.save
      render :json => {item: temp, eid: @label.id, notes: @note_json}
    end
  else
     if @label.notes != nil
        @note_json = []
        @label.notes.each do |note|
          @note_json << { eid: note.id }
        end
     else
       @note_json = []
     end
        render :json => {item: @label.item, eid: @label.id, notes: @note_json}
  end
end

end
