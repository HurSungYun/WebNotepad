require 'test_helper'

class LabelsControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end

  test '#create_label' do
    post :create, {'name' => 'label' }
    json = JSON.parse(response.body)
    assert json['name'] == 'label'
    assert json['item'] == 0
  end

  test '#read_label' do
    post :create, {'name' => 'label_read1'}
    post :create, {'name' => 'label_read2'}

    get :read
    json = JSON.parse(response.body)
    flag1 = false
    flag2 = false

    json.each do |json_entity|
      if json_entity['name'] == 'label_read1'
        flag1 = true
      end
      if json_entity['name'] == 'label_read2'
        flag2 = true
      end
    end
    assert flag1 == true
    assert flag2 == true
  end

  test '#tag_label' do

  end

  test '#untag_label' do

  end

  test '#delete_label' do
    post :create, {'name' => 'label' }
    json = JSON.parse(response.body)
    label_id = json['eid']

    post :delete, { 'id' => label_id }
    json = JSON.parse(response.body)
    assert label_id == json['eid']
  end

  
end
