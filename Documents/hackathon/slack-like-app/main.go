package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"slack-like-app/controller/user_controller"
	"slack-like-app/controller/messages_controller"
	"slack-like-app/dao"
	"syscall"
)

func main() {
	// ② /userでリクエストされたらnameパラメーターと一致する名前を持つレコードをJSON形式で返す
	fmt.Print("ok")

	http.HandleFunc("/search_user/", user_controller.SearchUserHandler)
	http.HandleFunc("/register_user/", user_controller.RegisterUserHandler)
	http.HandleFunc("/register_user/", messages_controller.FindMessagesHandler)

	// ③ Ctrl+CでHTTPサーバー停止時にDBをクローズする
	closeDBWithSysCall()

	// 8000番ポートでリクエストを待ち受ける
	log.Println("Listening...")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal(err)
	}
}

// ③ Ctrl+CでHTTPサーバー停止時にDBをクローズする
func closeDBWithSysCall() {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		s := <-sig
		log.Printf("received syscall, %v", s)

		if err := dao.CloseDB(); err != nil {
			log.Fatal(err)
		}
		log.Printf("success: dao.CloseDB()")
		os.Exit(0)
	}()
}
