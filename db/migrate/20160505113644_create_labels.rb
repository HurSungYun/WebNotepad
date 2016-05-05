class CreateLabels < ActiveRecord::Migration
  def change
    create_table :labels do |t|

      t.timestamps null: false
    end
  end
end
