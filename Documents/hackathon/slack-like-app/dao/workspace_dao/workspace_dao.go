package worksapce_dao

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

func RegisterWorkspace(workspace_data model.WorkspaceReqForPost) (model.WorkspaceResForPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
	// log.Println("uid:", uid)
	log.Println("id:", id)

	tx, err := db.Begin()
	if err != nil {
		return model.WorkspaceResForPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("INSERT INTO workspace (workspace_id, workspace_name, registered_at) VALUES (?, ?, ?)", id, workspace_data.WorkspaceName, t)
	if err != nil {
		return model.WorkspaceResForPost{}, err
	}
	log.Println("ok user table")

	log.Println(id, workspace_data.WorkspaceName, t)

	if err := tx.Commit(); err != nil {
		return model.WorkspaceResForPost{}, err
	}

	return model.WorkspaceResForPost{WorkspaceId: id, WorkspaceName: workspace_data.WorkspaceName, RegisteredAt: t}, nil
}
