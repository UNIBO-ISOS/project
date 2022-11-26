package controller

import (
	"customer-server/events"
	"customer-server/model"
	"customer-server/utils"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type CityController struct{}
type City = model.City

func (_ *CityController) GetCities(ctx *gin.Context) {

	// Create a new instance of the process.
	bk := strconv.FormatInt(time.Now().UnixNano(), 10)

	code, err := utils.StartNewProcess(bk)
	utils.GuardAgainstBadRequest(err, code, ctx)

	// Unlock the message
	code, err = utils.UnlockMessage("Message_askCities", bk)
	utils.GuardAgainstBadRequest(err, code, ctx)

	// ctx.Request.Header.Add("businessKey", bk)

	// Wait for the cities to be computed.
	var wg sync.WaitGroup
	var cities []City

	wg.Add(1)
	go ee.Once(events.CityEvent(bk), func(c []City) {
		cities = c
		ctx.JSON(http.StatusOK, cities)
		wg.Done()
	})
	wg.Wait()

}

func (c *CityController) PostCities(ctx *gin.Context) {
	var cities []City

	err := ctx.ShouldBindJSON(&cities)
	utils.GuradAgainstError(err, ctx)

	bk := ctx.Request.Header.Get("businessKey")
	if bk == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "businessKey is required"})
		return
	}

	ee.Emit(events.CityEvent(bk), cities)
	ctx.JSON(http.StatusOK, gin.H{})
}
