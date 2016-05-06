# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160505113644) do

  create_table "labels", force: :cascade do |t|
    t.string   "subject"
    t.integer  "item"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "labels_notes", id: false, force: :cascade do |t|
    t.integer "label_id"
    t.integer "note_id"
  end

  add_index "labels_notes", ["label_id"], name: "index_labels_notes_on_label_id"
  add_index "labels_notes", ["note_id"], name: "index_labels_notes_on_note_id"

  create_table "notes", force: :cascade do |t|
    t.string   "subject"
    t.text     "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
