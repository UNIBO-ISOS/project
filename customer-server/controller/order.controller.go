package controller

import (
	"customer-server/events"
	"customer-server/model"
	"customer-server/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

type OrderController struct{}

type OrderResponse struct {
	OrderID string `json:"orderId"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

type TokenValidationRequest struct {
	Token  string `json:"token"`
	Amount int    `json:"amount"`
}

type TokenValidatedResponse struct {
	Validated bool `json:"validated"`
}

func (o *OrderController) SendOrder(ctx *gin.Context) {
	var wg sync.WaitGroup
	var order model.Order
	ctx.ShouldBindJSON(&order)

	bk := ctx.Query("businessKey")
	if bk == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "businessKey is required"})
		return
	}

	body, _ := json.Marshal(order)

	fmt.Println(string(body))

	pv := utils.ProcessVariable{
		"order":      {"value": string(body), "type": "Json"},
		"restaurant": {"value": order.RestaurantId, "type": "String"},
	}
	code, err := utils.UnlockMessageWithVariables("Message_rcvOrder", bk, pv)
	utils.GuardAgainstBadRequest(err, code, ctx)

	var response OrderResponse

	wg.Add(1)
	go ee.Once(events.OrderEvent(bk), func(data OrderResponse) {
		response = data
		wg.Done()
	})
	wg.Wait()

	if response.Status == "error" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": response.Message})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (o *OrderController) WaitForSendOrder(ctx *gin.Context) {
	var orderResponse OrderResponse
	err := ctx.ShouldBindJSON(&orderResponse)
	utils.GuradAgainstError(err, ctx)

	bk := ctx.Request.Header.Get("businessKey")
	if bk == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "businessKey is required"})
		return
	}

	ee.Emit(events.OrderEvent(bk), orderResponse)
	ctx.JSON(http.StatusOK, orderResponse)
}

func (o *OrderController) SendToken(ctx *gin.Context) {
	var wg sync.WaitGroup
	var tokenValidation TokenValidationRequest
	var response TokenValidatedResponse
	ctx.ShouldBindJSON(&tokenValidation)
	bk := ctx.Query("businessKey")

	pv := utils.ProcessVariable{
		"token":  {"value": tokenValidation.Token, "type": "String"},
		"toUser": {"value": "acmeat", "type": "String"},
		"amount": {"value": tokenValidation.Amount, "type": "Integer"},
	}
	code, err := utils.UnlockMessageWithVariables("GetCustomerToken", bk, pv)
	utils.GuardAgainstBadRequest(err, code, ctx)

	fmt.Println("Waiting for token validation")
	fmt.Println("Business key: ", bk)
	wg.Add(1)
	go ee.Once(events.TokenValidationEvent(bk), func(data TokenValidatedResponse) {
		response = data
		wg.Done()
	})
	wg.Wait()
	fmt.Println("Token validation received")

	status := http.StatusOK
	if !response.Validated {
		status = http.StatusBadRequest
	}

	ctx.JSON(status, response)
}

func (o *OrderController) SendVerifyToken(ctx *gin.Context) {
	var response TokenValidatedResponse
	fmt.Println("abcabc")
	err := ctx.ShouldBindJSON(&response)
	utils.GuradAgainstError(err, ctx)

	bk := ctx.Request.Header.Get("businessKey")
	fmt.Println(bk)

	ee.Emit(events.TokenValidationEvent(bk), response)
	ctx.JSON(http.StatusOK, response)
}
