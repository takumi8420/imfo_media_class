package message_dao

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/oklog/ulid/v2"
	"log"
	"math/rand"
	"os"
	"slack-like-app/model"
	"time"
)

var db *sql.DB

func init() {
	// ①-1 環境変数を用いる

	mysqlUser := os.Getenv("MYSQL_USER")
	mysqlPwd := os.Getenv("MYSQL_PWD")
	mysqlHost := os.Getenv("MYSQL_HOST")
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")

	connStr := fmt.Sprintf("%s:%s@%s/%s", mysqlUser, mysqlPwd, mysqlHost, mysqlDatabase)
	_db, err := sql.Open("mysql", connStr)

	// ①-2
	//_db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@(localhost:3306)/%s", mysqlUser, mysqlPwd, mysqlDatabase))
	if err != nil {
		log.Fatalf("fail: sql.Open, %v\n", err)
	}
	// ①-3
	if err := _db.Ping(); err != nil {
		log.Fatalf("fail: _db.Ping, %v\n", err)
	}
	db = _db
}

func CloseDB() error {
	return db.Close()
}

func FindMessagesById(user_id string) (*[]model.MessagesResForGet, error) {

	rows, err := db.Query("SELECT messages.message_id, messages.channel_id, messages.user_id, messages.contents, messages.created_at, user.user_name FROM messages LEFT JOIN user ON messages.use_id=user.use_id WHERE user.user_id = ?", user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	log.Print("rows:", rows)

	//var u model.UserResForHTTPGet
	//if rows.Next() {
	//	if err := rows.Scan(&u.Id, &u.Name, &u.Age); err != nil {
	//		return nil, err
	//	}
	//}
	messages := make([]model.MessagesResForGet, 0)
	for rows.Next() {
		var u model.MessagesResForGet
		if err := rows.Scan(&u.MessageId, &u.ChannelId, &u.UserId, &u.Contents, &u.CreatedAt); err != nil {
			log.Printf("fail: rows.Scan, %v\n", err)

			if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
				log.Printf("fail: rows.Close(), %v\n", err)
			}
			//w.WriteHeader(http.StatusInternalServerError)
			//return
		}
		messages = append(messages, u)
	}
	log.Print("u:", &messages)
	return &messages, nil
}

func SendMessages(messasge_data model.MessagesReqForPost) (model.MessagesResForPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
	// log.Println("uid:", uid)
	log.Println("id:", id)

	tx, err := db.Begin()
	if err != nil {
		return model.MessagesResForPost{}, err
	}
	defer tx.Rollback()

	log.Println("ここからinsert")

	_, err = tx.Exec("INSERT INTO messages (message_id, channel_id, user_id, contents, created_at) VALUES (?, ?, ?, ?, ?)", id, messasge_data.ChannelId, messasge_data.UserId, messasge_data.Contents, t)
	if err != nil {
		return model.MessagesResForPost{}, err
	}
	log.Println("ok user table")

	log.Println(id, messasge_data.ChannelId, messasge_data.UserId, messasge_data.Contents, t)

	if err := tx.Commit(); err != nil {
		return model.MessagesResForPost{}, err
	}

	return model.MessagesResForPost{MessageId: id, ChannelId: messasge_data.ChannelId, UserId: messasge_data.UserId, Contents: messasge_data.Contents, CreatedAt: t}, nil
}
