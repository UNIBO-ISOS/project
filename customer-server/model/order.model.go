package model

type Order struct {
	RestaurantId string   `json:"restaurantId,required"`
	Price        float32  `json:"price,required"`
	Menu         []string `json:"menu,required"`
	Hour         string   `json:"hour,required"`
	Address      string   `json:"address,required"`
}
