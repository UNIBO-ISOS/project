package model

type Restaurant struct {
	ID   string `json:"_id,required"`
	Name string `json:"name,required"`
	Menu []Menu `json:"menu,required"`
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
	Category []int  `json:"category"`
}
