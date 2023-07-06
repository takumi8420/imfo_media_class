package user_controller

import (
	"encoding/json"
	"log"
	"net/http"
	"slack-like-app/dao/user_dao"
	"strings"
)

func SearchUserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		log.Printf("fail: HTTP Method is %s\n", r.Method)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	path := r.URL.Path
	segments := strings.Split(path, "/")
	uid := segments[len(segments)-1]
	log.Println(uid)

	if uid == "" {
		log.Println("fail: uid is empty")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := user_dao.FindUsersByUid(uid)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Println("ok getuserbyname user", user)

	bytes, err := json.Marshal(user)
	if err != nil {
		log.Printf("fail: json.Marshal, %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Println("変換終了 bytes", bytes)
	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}
