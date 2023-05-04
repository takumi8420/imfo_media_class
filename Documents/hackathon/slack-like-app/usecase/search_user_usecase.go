package usecase

import (
	"new_db/dao"
	"new_db/model"
)

func GetUserByName(name string) ([]model.UserResForHTTPGet, error) {
	return dao.FindUsersByName(name)
}
