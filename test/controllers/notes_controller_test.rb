require 'test_helper'

class NotesControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end

  test '#create_note_success' do
    post :create, {'subject' => 'subject', 'content' => 'content'}
    json = JSON.parse(response.body)
    assert json['subject'] == 'subject'
  end

  test '#read_note' do
    post :create, {'subject' => 'subject_read1', 'content' => 'content1'}
    post :create, {'subject' => 'subject_read2', 'content' => 'content2'}

    get :read
    json = JSON.parse(response.body)
    flag1 = false
    flag2 = false
    json.each do |json_entity|
      if json_entity['subject'] == 'subject_read1'
        flag1 = true
      end
      if json_entity['subject'] == 'subject_read2'
        flag2 = true
      end
    end
    assert flag1 == true
    assert flag2 == true
  end

  test '#update_note' do
    post :create, {'subject' => 'subject3', 'content' => 'content3'}
    json = JSON.parse(response.body)
    note_id = json['eid']

    post :update, {'subject' => 'new_subject', 'content' => 'new_content', 'id' => note_id}
    json = JSON.parse(response.body)
    assert note_id == json['eid']
    assert json['subject'] == 'new_subject'
  end

  test '#delete_note' do
    post :create, {'subject' => 'subject3', 'content' => 'content3'}
    json = JSON.parse(response.body)
    note_id = json['eid']

    post :delete, {'id' => note_id }
    json = JSON.parse(response.body)
    assert note_id == json['eid']
  end

end
