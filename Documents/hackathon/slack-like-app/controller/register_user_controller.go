package controller

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"new_db/model"
	"new_db/usecase"
)

func RegisterUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Printf("fail: HTTP Method is %s\n", r.Method)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	contentType := r.Header.Get("Content-Type")
	if contentType != "application/json" {
		log.Println("fail: Content-Type is not application/json")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("fail: ioutil.ReadAll, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var u model.UserReqForHTTPPost
	if err := json.Unmarshal(body, &u); err != nil {
		log.Printf("fail: json.Unmarshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response, err := usecase.CreateUser(u)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	responseBody, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(responseBody)
}
