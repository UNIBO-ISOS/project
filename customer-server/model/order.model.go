package model

type Order struct {
	RestaurantId string   `json:"restaurantId,required"`
	Price        float32  `json:"price,required"`
	MenuId       []string `json:"menuId,required"`
}
