Feature: Note

Scenario: Add New Note
  Given the main page
  And Note create mode is shown
  When I fill subject "addNewNote" and "addNewNote_content" in form
  And I click Apply button
  And wait until the message is shown for "2" seconds
  Then I should see the message "note is created successfully"
  And subject and content of note are "addNewNote" and "addNewNote_content"

Scenario: Edit Note
  Given the main page
  And one note is created already with "editNote" and "editNote_content"
  When I click the content box
  And I change the content of note as "modified"
  And I click Edit button
  And wait until the message is shown for "2" seconds
  Then I should see the message "note is updated successfully"
  And subject and content of note are "editNote" and "modified"
  
Scenario: Delete Note
  Given the main page
  And one note is created already with "deleteNote" and "deleteNote_content"
  When I click Delete button
  And wait until the message is shown for "2" seconds
  Then I should see the message "note is deleted successfully"
