package main

import (
	"log"
	"net/http"
	"new_db/controller"
	"new_db/dao"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	// ② /userでリクエストされたらnameパラメーターと一致する名前を持つレコードをJSON形式で返す
	http.HandleFunc("/search_user", controller.SearchUserHandler)
	http.HandleFunc("/register_user", controller.RegisterUserHandler)

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
