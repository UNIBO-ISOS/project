class Courier
  include Mongoid::Document
  include Mongoid::Timestamps  

  field :name, type: String
  field :location, type: GeoJSON::Point
  index({location: '2dsphere'})
end
