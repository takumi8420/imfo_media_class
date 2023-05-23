package model


type UserResForHTTPGet struct {
	User_id   string `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

type UserReqForHTTPPost struct {
	Name string `json:"name"`
	Age  int64  `json:"age"`
}

type UserResForHTTPPost struct {
	Id string `json:"id"`
}
