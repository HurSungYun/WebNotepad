class CreateLabels < ActiveRecord::Migration
  def change
    create_table :labels do |t|
      t.string :subject
      t.integer :item

      t.timestamps null: false
    end

    create_table :labels_notes, id: false do |t|
      t.belongs_to :label, index: true
      t.belongs_to :note, index: true
    end
  end
#  add_foreign_key :labels, :notes
end
