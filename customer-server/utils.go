package main

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
	"messageName": "Message_rcvCity",
    "businessKey": "default",
    "resultEnabled" : true,
    "processVariables": {
        "cityId": {
            "value": "62f6668ec28d1d9c5ccf326d",
            "type": "String"
        }
    }
*/

type ProcessVariable = map[string]map[string]string

type ReceiveMessage struct {
	MessageName      string          `json:"messageName"`
	BusinessKey      string          `json:"businessKey"`
	ResultEnabled    bool            `json:"resultEnabled"`
	ProcessVariables ProcessVariable `json:"processVariables"`
}

func UnlockMessage(messageName, bkey string) (int, error) {
	msg := ReceiveMessage{
		MessageName:      messageName,
		BusinessKey:      bkey,
		ResultEnabled:    true,
		ProcessVariables: map[string]map[string]string{},
	}

	body, _ := json.Marshal(msg)
	res, err := http.Post("http://camunda:8080/engine-rest/message/", "application/json", bytes.NewBuffer(body))

	return res.StatusCode, err
}

func UnlockMessageWithVariables(messageName, bkey string) {

}

func StartNewProcess(bkey string) (int, error) {
	res, err := http.Post(
		"http://camunda:8080/engine-rest/process-definition/key/Process_0eo6cql/start",
		"application/json",
		bytes.NewBuffer([]byte(`{
			"businessKey": "`+bkey+`"
		}`)),
	)

	return res.StatusCode, err
}

func guardAgainstError(err error, code int, c *gin.Context) {
	if err != nil || code >= 400 {
		c.JSON(code, gin.H{"error": err.Error()})
		panic(err)
	}
}
