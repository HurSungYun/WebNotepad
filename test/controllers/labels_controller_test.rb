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
    label = Label.new
    label.subject = "tag_label"
    label.item = 0
    label.save
    label_tag = label.id

    a = Note.new
    a.subject = "tag1"
    a.content = "content"
    a.save
    id_tag1 = a.id
    a = Note.new
    a.subject = "tag2"
    a.content = "content"
    a.save
    id_tag2 = a.id

    post :tagLabel, {'id' => label_tag, 'list' => [id_tag1, id_tag2]}
    json = JSON.parse(response.body)
    
    assert json['eid'] == label_tag
    assert json['item'] == 2
    assert json['notes'][0]['eid'] == id_tag1 
    assert json['notes'][1]['eid'] == id_tag2
  end

  test '#untag_label' do

    label = Label.new
    label.subject = "tag_label"
    label.item = 0
    label.save
    label_tag = label.id

    a = Note.new
    a.subject = "tag1"
    a.content = "content"
    a.save
    id_tag1 = a.id
    b = Note.new
    b.subject = "tag2"
    b.content = "content"
    b.save
    id_tag2 = b.id

    label.notes.push(a)
    label.notes.push(b)

    post :untagLabel, {'id' => label_tag, 'list' => [id_tag1, id_tag2]}

    json = JSON.parse(response.body)

    assert json['eid'] == label_tag
    assert json['item'] == 0
  end

  test '#delete_label' do
    a = Label.new
    a.subject = "delete_label"
    a.item = 0
    a.save
    label_id = a.id

    post :delete, { 'id' => label_id }
    json = JSON.parse(response.body)
    assert label_id == json['eid']
  end

  
end
