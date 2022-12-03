package events

func CityEvent(bk string) string {
	return "cityEvent_" + bk
}

func RestaurantEvent(bk string) string {
	return "restaurantEvent_" + bk
}

func OrderEvent(bk string) string {
	return "orderEvent_" + bk
}

func TokenValidationEvent(bk string) string {
	return "tokenValidationEvent_" + bk
}

func CancelOrderEvent(bk string) string {
	return "cancelOrderEvent_" + bk
}
