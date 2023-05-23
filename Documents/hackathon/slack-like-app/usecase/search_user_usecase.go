package usecase

import (
	"slack-like-app/dao"
	"slack-like-app/model"
)

func GetUserByName(uid string) ([]model.UserResForHTTPGet, error) {
	return dao.FindUsersByName(uid)
}
