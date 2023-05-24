package model

type UserResForHTTPGet struct {
	Id   string `json:"user_id"`
	Name string `json:"user_name"`
	Age  int    `json:"age"`
}

type UserReqForHTTPPost struct {
	Name string `json:"name"`
	Age  int64  `json:"age"`
}

type UserResForHTTPPost struct {
	Id string `json:"id"`
}
