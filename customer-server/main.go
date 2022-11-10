package main

import (
	"fmt"
	"strconv"
	"sync"
	"time"

	m "customer-server/model"

	"github.com/gin-gonic/gin"
	"github.com/jiyeyuran/go-eventemitter"
)

type City = m.City

var ee = eventemitter.NewEventEmitter()

func main() {
	router := gin.Default()

	router.GET("/cities", func(c *gin.Context) {
		// Create a new instance of the process.
		bk := strconv.FormatInt(time.Now().UnixNano(), 10)

		code, err := StartNewProcess(bk)
		guardAgainstError(err, code, c)

		// Unlock the message
		code, err = UnlockMessage("Message_askCities", bk)
		guardAgainstError(err, code, c)

		c.Request.Header.Add("businessKey", bk)

		// Wait for the cities to be computed.
		var wg sync.WaitGroup
		var cities []City

		wg.Add(1)
		go ee.Once(bk, func(c []City) {
			cities = c
			wg.Done()
		})
		wg.Wait()

		c.JSON(200, cities)
	})

	router.POST("/cities", func(c *gin.Context) {
		var cities []City
		err := c.ShouldBindJSON(&cities)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		fmt.Println(cities)

		bk := c.Request.Header.Get("businessKey")
		if bk == "" {
			c.JSON(400, gin.H{"error": "businessKey is required"})
			return
		}

		// TODO: Use business key to identify the event.
		ee.Emit(bk, cities)
		c.JSON(200, gin.H{})
	})

	router.Run(":3001")
}
