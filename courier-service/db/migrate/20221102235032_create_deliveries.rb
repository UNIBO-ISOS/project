class CreateDeliveries < ActiveRecord::Migration[7.0]
  def change
    create_table :deliveries do |t|
      t.references :courier, null: false, foreign_key: true
      t.string :order_id, null: false
      t.float :restaurant_lat, null: false
      t.float :restaurant_lng, null: false
      t.float :destination_lat, null: false
      t.float :destination_lng, null: false
      t.string :status, :default=> "created"
      t.float :price, :default => 0.0

      t.timestamps
    end
  end
end
