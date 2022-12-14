package controller

import (
	"customer-server/events"
	"customer-server/model"
	"customer-server/utils"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

type RestaurantController struct{}
type Restaurant = model.Restaurant

func (rc RestaurantController) GetRestaurants(ctx *gin.Context) {
	var wg sync.WaitGroup
	var restaurants []Restaurant

	bk := ctx.Query("businessKey")
	if bk == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "business key is required",
		})
		return
	}

	// Take city parameter from the request
	cityId := ctx.Query("cityId")
	if cityId == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "city is required",
		})
		return
	}

	pv := utils.ProcessVariable{"cityId": {"value": cityId, "type": "String"}}
	utils.UnlockMessageWithVariables("Message_rcvCity", bk, pv)

	wg.Add(1)
	go ee.Once(events.RestaurantEvent(bk), func(data []Restaurant) {
		restaurants = data
		wg.Done()
	})
	wg.Wait()

	ctx.JSON(http.StatusOK, restaurants)
}

func (rc RestaurantController) PostRestaurants(ctx *gin.Context) {
	var restaurants []Restaurant
	err := ctx.ShouldBindJSON(&restaurants)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bk := ctx.Request.Header.Get("businessKey")
	if bk == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "businessKey is required"})
		return
	}

	ee.Emit(events.RestaurantEvent(bk), restaurants)

	ctx.JSON(http.StatusOK, gin.H{})
}
