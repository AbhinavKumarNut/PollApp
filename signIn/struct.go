package main

import "time"

type RegisterInfo struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type LoginInfo struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type PollInfo struct {
	PollId    int       `json:"poll_id"`
	Title     string    `json:"title"`
	Options   []string  `json:"options"`
	CreatedAt time.Time `json:"created_at"`
	CreatedBy string    `json:"created_by"`
}

type VoteInfo struct {
	PollID   int    `json:"poll_id"`
	Username string `json:"username"`
	Option   string `json:"option"`
}
