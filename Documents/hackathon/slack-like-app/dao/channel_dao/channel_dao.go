package channel_dao

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

func RegisterChannel(channel_data model.ChannelReqForPost) (model.ChannelResForPost, error) {
	t := time.Now()
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
	// log.Println("uid:", uid)
	log.Println("id:", id)

	tx, err := db.Begin()
	if err != nil {
		return model.ChannelResForPost{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("INSERT INTO channel (channel_id, channel_name, workspace_id, registered_at) VALUES (?, ?, ?, ?)", id, channel_data.ChannelName, channel_data.WorkspaceId, t)
	if err != nil {
		return model.ChannelResForPost{}, err
	}
	log.Println("ok user table")

	log.Println(id, channel_data.ChannelName,channel_data.WorkspaceId, t)

	if err := tx.Commit(); err != nil {
		return model.ChannelResForPost{}, err
	}

	return model.ChannelResForPost{ChannelId: id, ChannelName : channel_data.ChannelName, WorkspaceId: channel_data.WorkspaceId, RegisteredAt: t}, nil
}
