class LabelsController < ApplicationController

def read
  @labels = Label.all
  @json = []
  @labels.each do |label|
    @json << {name: label.name, eid: label.id}
  end

  render :json => @json.to_json
end


end
