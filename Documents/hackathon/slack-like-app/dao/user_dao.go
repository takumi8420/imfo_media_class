package dao

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

//
//func FindUsersByName(uid string) ([]model.UserResForHTTPGet, error) {
//	rows, err := db.Query("SELECT user_name, age, registered_at FROM user_account WHERE firebase_id = ?", uid)
//	if err != nil {
//		return nil, err
//	}
//	defer rows.Close()
//
//	users := make([]model.UserResForHTTPGet, 0)
//	for rows.Next() {
//		var u model.UserResForHTTPGet
//		if err := rows.Scan(&u.User_id, &u.Name, &u.Age); err != nil {
//			return nil, err
//		}
//		users = append(users, u)
//	}
//
//	return users, nil
//}

func FindUsersByName(uid string) (*model.UserResForHTTPGet, error) {
	//rows, err := db.Query("SELECT user.user_id, user.user_name, user.age FROM user_account JOIN user ON user_account.user_id = user.id WHERE user_account.firebase_id = ?", uid)
	//if err != nil {
	//	return nil, err
	//}
	//defer rows.Close()
	//
	//users := make([]model.UserResForHTTPGet, 0)
	//for rows.Next() {
	//	var u model.UserResForHTTPGet
	//	if err := rows.Scan(&u.User_id, &u.Name, &u.Age); err != nil {
	//		return nil, err
	//	}
	//	users = append(users, u)
	//}
	//
	//return users, nil

	rows, err := db.Query("SELECT user.user_id, user.user_name, user.age FROM user_account JOIN user ON user_account.user_id = user.id WHERE user_account.firebase_id = ?", uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var u model.UserResForHTTPGet
	if rows.Next() {
		if err := rows.Scan(&u.User_id, &u.Name, &u.Age); err != nil {
			return nil, err
		}
	}

	return &u, nil
}

func CreateUser(user model.UserReqForHTTPPost) (model.UserResForHTTPPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()

	tx, err := db.Begin()
	if err != nil {
		return model.UserResForHTTPPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("INSERT INTO user_test (id, name, age) VALUES (?, ?, ?)", id, user.Name, user.Age)
	if err != nil {
		return model.UserResForHTTPPost{}, err
	}

	if err := tx.Commit(); err != nil {
		return model.UserResForHTTPPost{}, err
	}

	return model.UserResForHTTPPost{Id: id}, nil
}

func CloseDB() error {
	return db.Close()
}
