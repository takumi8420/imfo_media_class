package user_dao

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/oklog/ulid/v2"
	"log"
	"math/rand"
	"slack-like-app/model"
	"time"
)

var db *sql.DB

func init() {
	// ①-1 環境変数を用いる

	//mysqlUser := os.Getenv("MYSQL_USER")
	//mysqlPwd := os.Getenv("MYSQL_PWD")
	//mysqlHost := os.Getenv("MYSQL_HOST")
	//mysqlDatabase := os.Getenv("MYSQL_DATABASE")
	//
	//connStr := fmt.Sprintf("%s:%s@%s/%s", mysqlUser, mysqlPwd, mysqlHost, mysqlDatabase)
	//_db, err := sql.Open("mysql", connStr)

	//if err != nil {
	//	log.Fatalf("fail: sql.Open, %v\n", err)
	//}
	//
	//if err := _db.Ping(); err != nil {
	//	log.Fatalf("fail: _db.Ping, %v\n", err)
	//}
	//db = _db

	mysqlUser := "test_user"
	mysqlUserPwd := "password"
	mysqlDatabase := "slack_like_app"

	// ①-2
	_db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@(localhost:3306)/%s", mysqlUser, mysqlUserPwd, mysqlDatabase))
	if err != nil {
		log.Fatalf("fail: sql.Open, %v\n", err)
	}
	// ①-3
	if err := _db.Ping(); err != nil {
		log.Fatalf("fail: _db.Ping, %v\n", err)
	}
	db = _db
}

func FindUsersByUid(uid string) (*model.UserResForHTTPGet, error) {

	rows, err := db.Query("SELECT user_account.user_id, user.user_name, user.age FROM user_account LEFT JOIN user ON user_account.user_id = user.user_id WHERE user_account.firebase_id = ?", uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	log.Println("rows:", rows)

	var u model.UserResForHTTPGet
	if rows.Next() {
		if err := rows.Scan(&u.Id, &u.Name, &u.Age); err != nil {
			return nil, err
		}
	}

	log.Println("u:", &u)
	return &u, nil
}

func CreateUser(user model.UserReqForHTTPPost, uid string) (model.UserResForHTTPPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
	log.Println("uid:", uid)
	log.Println("id:", id)
	log.Println(user.Name, user.Age)
	img_url := "https://firebasestorage.googleapis.com/v0/b/term3-takumi-kon.appspot.com/o/image%2F%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202023-06-09%2020.41.05.png?alt=media&token=0bd9e171-da57-4c8f-9b57-ee53c6411f5d"

	tx, err := db.Begin()
	if err != nil {
		return model.UserResForHTTPPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("INSERT INTO user (user_id, user_name, age, registered_at, photo_url) VALUES (?, ?, ?, ?, ?)", id, user.Name, user.Age, t, img_url)
	if err != nil {
		return model.UserResForHTTPPost{}, err
	}
	log.Println("ok user table")

	t1 := time.Now()
	entropy1 := ulid.Monotonic(rand.New(rand.NewSource(t1.UnixNano())), 0)
	id1 := ulid.MustNew(ulid.Timestamp(t), entropy1).String()

	log.Println("id1,id,uid", id1, id, uid)

	_, err = tx.Exec("INSERT INTO user_account (user_id_uid, user_id, firebase_id) VALUES (?, ?, ?)", id1, id, uid)
	if err != nil {
		return model.UserResForHTTPPost{}, err
	}
	log.Println("ok user_account table")

	if err := tx.Commit(); err != nil {
		return model.UserResForHTTPPost{}, err
	}

	return model.UserResForHTTPPost{Id: id}, nil
}

func RegisterUserAndChannel(req model.UserAndChannelReqForPost, uid string) (model.UserAndChannelResForPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
	log.Println("urlは:", uid)
	log.Println("id:", id)

	tx, err := db.Begin()
	if err != nil {
		return model.UserAndChannelResForPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("INSERT INTO channel_members (channel_member_id, channel_id, workspace_id, user_id) VALUES (?, ?, ?, ?)", id, req.ChannelId, req.WorkspaceId, uid)
	if err != nil {
		return model.UserAndChannelResForPost{}, err
	}
	log.Println("ok user table")

	log.Println("ok user_account table")

	if err := tx.Commit(); err != nil {
		return model.UserAndChannelResForPost{}, err
	}

	return model.UserAndChannelResForPost{ChannelMemberId: id, ChannelId: req.ChannelId, WorkspaceId: req.WorkspaceId, UserId: uid}, nil
}

func RegisterUserAndWorkspace(req model.UserAndWorkplaceReqForPost, uid string) (model.UserAndWorkspaceResForPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
	log.Println("uid:", uid)
	log.Println("id:", id)

	tx, err := db.Begin()
	if err != nil {
		return model.UserAndWorkspaceResForPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("INSERT INTO workspace_members (workspace_member_id, workspace_id, user_id, workspace_user_name) VALUES (?, ?, ?, ?)", id, req.WorkspaceId, uid, req.Name)
	if err != nil {
		return model.UserAndWorkspaceResForPost{}, err
	}
	log.Println("ok user table")

	log.Println("ok user_account table")

	if err := tx.Commit(); err != nil {
		return model.UserAndWorkspaceResForPost{}, err
	}

	return model.UserAndWorkspaceResForPost{WorkspaceMemberId: id, WorkspaceId: req.WorkspaceId, UserId: uid, WorkspaceUserName: req.Name}, nil
}

func RegisterPhotoURL(user model.UserPhotoReqForHTTPPost, uid string) (model.UserPhotoResForHTTPPost, error) {

	log.Println(user.UserPhotoURL)
	tx, err := db.Begin()
	if err != nil {
		return model.UserPhotoResForHTTPPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("UPDATE user SET photo_url = ? WHERE user_id = ?", user.UserPhotoURL, user.Id)

	if err != nil {
		return model.UserPhotoResForHTTPPost{}, err
	}
	log.Println("ok user table")

	if err := tx.Commit(); err != nil {
		return model.UserPhotoResForHTTPPost{}, err
	}

	return model.UserPhotoResForHTTPPost{Id: uid, UserPhotoURL: user.UserPhotoURL}, nil
}
