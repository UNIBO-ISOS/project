package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

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

type ProcessVariable = map[string]map[string]interface{}

type ReceiveMessage struct {
	MessageName      string          `json:"messageName"`
	BusinessKey      string          `json:"businessKey"`
	ResultEnabled    bool            `json:"resultEnabled"`
	ProcessVariables ProcessVariable `json:"processVariables"`
}

func UnlockMessage(messageName, bkey string) (int, error) {
	msg := ReceiveMessage{
		MessageName:   messageName,
		BusinessKey:   bkey,
		ResultEnabled: true,
	}

	body, _ := json.Marshal(msg)
	camundaUrl := os.Getenv("CAMUNDA_URL")
	res, err := http.Post(camundaUrl+"/message/", "application/json", bytes.NewBuffer(body))

	return res.StatusCode, err
}

func UnlockMessageWithVariables(messageName, bkey string, processVariables ProcessVariable) (int, error) {
	msg := ReceiveMessage{
		MessageName:      messageName,
		BusinessKey:      bkey,
		ResultEnabled:    true,
		ProcessVariables: processVariables,
	}

	obj, err := json.Marshal(msg)
	fmt.Println(string(obj))

	body, _ := json.Marshal(msg)

	camundaUrl := os.Getenv("CAMUNDA_URL")
	fmt.Println(camundaUrl)
	res, err := http.Post(camundaUrl+"/message/", "application/json", bytes.NewBuffer(body))

	return res.StatusCode, err
}

func StartNewProcess(bkey string) (int, error) {
	camundaUrl := os.Getenv("CAMUNDA_URL")
	processName := os.Getenv("PROCESS_NAME")
	res, err := http.Post(
		camundaUrl+"/process-definition/key/"+processName+"/start",
		"application/json",
		bytes.NewBuffer([]byte(`{
			"businessKey": "`+bkey+`"
		}`)),
	)

	return res.StatusCode, err
}

func GuardAgainstBadRequest(err error, code int, ctx *gin.Context) {
	if err != nil || code >= 400 {
		ctx.JSON(code, gin.H{"error": err.Error()})
		panic(err)
	}
}

func GuradAgainstError(err error, ctx *gin.Context) {
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err)
	}
}

func PrintBody(ctx *gin.Context) {
	body, _ := ioutil.ReadAll(ctx.Request.Body)
	fmt.Println(string(body))
}
