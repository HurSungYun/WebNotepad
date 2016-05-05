class Note < ActiveRecord::Base

has_many :notes, :labels

end
