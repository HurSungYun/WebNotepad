Given /^the main page$/ do
  visit('/')
end

Given /^Note create mode is shown$/ do
  if page.has_content?("New Memo")
    click_button("newNoteModeButton")
  end
end

When /^I fill subject "(.*?)" and "(.*?)" in form$/ do |arg1, arg2|
  fill_in('formTextSubject', :with => arg1)
  fill_in('formTextContent', :with => arg2)
end

When /^I click Apply button$/ do
  click_button('newNoteButton')
end

And /^wait until the message is shown for "(.*?)" seconds$/ do |arg1|
  sleep arg1.to_i
end

Then /^I should see the message "(.*?)"$/ do |arg1|
  print page.has_content?("arg1")

end

Then /^subject and content of note are "(.*?)" and "(.*?)"$/ do |arg1, arg2|
  print page.has_content?(arg1)
  print page.has_content?(arg2)
  print page.text
  print page.find('formTextSubject', :text => arg1) 
  print page.find('formTextContent', :text => arg2)
end


Given /^one note is created already with "(.*?)" and "(.*?)"$/ do |arg1, arg2|

end

When /^I click the content box$/ do
  
end

When /^I change the content of note as "(.*?)"$/ do |arg1|

end

When /^I click Edit button$/ do
  click_button("editNoteButton")
end

When /^I click Delete button$/ do
  click_button("deleteNoteButton")
end
