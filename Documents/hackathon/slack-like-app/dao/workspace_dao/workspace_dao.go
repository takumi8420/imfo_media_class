package worksapce_dao

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/oklog/ulid/v2"
	"log"
	"math/rand"
	"slack-like-app/model"
	"time"
)

var db *sql.DB

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

	return model.WorkspaceResForPost{WorkspaceId: id, WorkspaceName : workspace_data.WorkspaceName, RegisteredAt: t}, nil
}
