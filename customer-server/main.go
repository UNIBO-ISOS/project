package main

import (
	"customer-server/controller"
	m "customer-server/model"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jiyeyuran/go-eventemitter"
)

type City = m.City
type Restaurant = m.Restaurant

var ee = eventemitter.NewEventEmitter()

func main() {
	router := gin.Default()

	// Enable CORS
	config := cors.Config{}
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type"}
	router.Use(cors.New(config))

	cityController := controller.CityController{}
	cities := router.Group("/cities")
	cities.GET("/", cityController.GetCities)
	cities.POST("/", cityController.PostCities)

	restaurantController := controller.RestaurantController{}
	restaurants := router.Group("/restaurants")
	restaurants.GET("/", restaurantController.GetRestaurants)
	restaurants.POST("/", restaurantController.PostRestaurants)

	orderController := controller.OrderController{}
	orders := router.Group("/orders")
	{
		orders.POST("/", orderController.SendOrder)
		orders.POST("/wait", orderController.WaitForSendOrder)
		orders.POST("/sendToken", orderController.SendToken)
		orders.POST("/verifyToken", orderController.SendVerifyToken)
		orders.GET("/cancel", orderController.CancelOrder)
		orders.POST("/waitCancel", orderController.WaitCancelOrder)
	}

	router.Run(":3001")
}
