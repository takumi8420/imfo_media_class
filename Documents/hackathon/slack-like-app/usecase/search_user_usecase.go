package usecase

import (
	"slack-like-app/dao"
	"slack-like-app/model"
)

func GetUserByName(name string) ([]model.UserResForHTTPGet, error) {
	return dao.FindUsersByName(name)
}
