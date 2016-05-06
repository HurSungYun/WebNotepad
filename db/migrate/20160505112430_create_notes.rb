class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :subject
      t.text :content
       
      t.timestamps null: false
    end
  end
#  add_foreign_key :notes, :labels
end
