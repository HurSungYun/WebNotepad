class LabelsController < ApplicationController

def create
  @label = Label.new
  @label.subject = params[:name]

  if @label.save
    render :json => { "name": @label.subject, "eid": @label.id }
  end
end


def read
  @labels = Label.all
  @json = []
  @labels.each do |label|
    @json << {name: label.subject, eid: label.id}
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

end
