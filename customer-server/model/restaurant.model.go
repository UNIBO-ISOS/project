package model

import geojson "github.com/paulmach/go.geojson"

type Restaurant struct {
	ID       string           `json:"_id"`
	Name     string           `json:"name"`
	City     City             `json:"city"`
	Location geojson.Geometry `json:"location"`
	Hours    []opening        `json:"hours"`
}

type opening struct {
	Day       string      `json:"day"`
	Timetable []timetable `json:"timetable"`
}

type timetable struct {
	Start  string `json:"start"`
	Finish string `json:"finish"`
}

type Menu struct {
	ID          string     `json:"_id"`
	Name        string     `json:"name"`
	Description string     `json:"desc"`
	Price       float32    `json:"price"`
	Items       []menuItem `json:"items"`
	Categoires  []string   `json:"categories"`
}

type menuItem struct {
	ID       string `json:"_id"`
	Name     string `json:"name"`
	Category int    `json:"category"`
}
