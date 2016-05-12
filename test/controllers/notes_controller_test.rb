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
    note1 = Note.new
    note1.subject = 'subject_read1'
    note1.content = 'content_read1'
    note1.save
    note2 = Note.new
    note2.subject = 'subject_read2'
    note2.content = 'content_read2'
    note2.save

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
    note = Note.new
    note.subject = 'subject3'
    note.content = 'content3'
    note.save

    post :update, {'subject' => 'new_subject', 'content' => 'new_content', 'id' => note.id}
    json = JSON.parse(response.body)
    assert note.id == json['eid']
    assert json['subject'] == 'new_subject'
  end

  test '#delete_note' do
    note = Note.new
    note.subject = 'subject3'
    note.content = 'content3'
    note.save

    post :delete, {'id' => note.id }
    json = JSON.parse(response.body)
    assert note.id == json['eid']
  end

end
