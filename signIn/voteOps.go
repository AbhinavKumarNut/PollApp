package main

import (
	"context"
	"encoding/json"
	"net/http"
	"signIn/ent"
	"signIn/ent/votes"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func ShowVotes(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var pollId PollInfo
		err := json.NewDecoder(r.Body).Decode(&pollId)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		votes, err := client.Votes.
			Query().
			Where(votes.PollID(pollId.PollId)).
			Only(context.Background())

		if ent.IsNotFound(err) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]interface{}{})
			return
		}
		if err != nil {
			http.Error(w, "Failed to fetch vote data", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(votes.Votes)
	}
}

func CreateVote(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var userVote VoteInfo
		err := json.NewDecoder(r.Body).Decode(&userVote)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if userVote.Option == "" {
			http.Error(w, "Option is required", http.StatusBadRequest)
			return
		}

		row, err := client.Votes.
			Query().
			Where(votes.PollID(userVote.PollID)).
			Only(context.Background())

		if err != nil {
			row, _ = client.Votes.
				Create().
				SetPollID(userVote.PollID).
				SetVotes(map[string][]string{}).
				Save(context.Background())
		}

		votemap := row.Votes
		votemap[userVote.Option] = append(votemap[userVote.Option], userVote.Username)

		_, err = row.Update().
			SetVotes(votemap).
			Save(context.Background())
		if err != nil {
			http.Error(w, "Failed to add vote", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(userVote)

	}
}

func CheckVoteStatus(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		pollIdStr := r.URL.Query().Get("pollId")
		userId := r.URL.Query().Get("userId")

		if pollIdStr == "" || userId == "" {
			http.Error(w, "pollId and userId are required", http.StatusBadRequest)
			return
		}

		pollId, err := strconv.Atoi(pollIdStr)
		if err != nil {
			http.Error(w, "Invalid pollId format", http.StatusBadRequest)
			return
		}

		voteRow, err := client.Votes.
			Query().
			Where(votes.PollID(pollId)).
			Only(context.Background())

		if err != nil {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"hasVoted": false,
				"userVote": "",
			})
			return
		}

		userVote := ""
		hasVoted := false
		for option, userList := range voteRow.Votes {
			for _, u := range userList {
				if u == userId {
					userVote = option
					hasVoted = true
					break
				}
			}
			if hasVoted {
				break
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"hasVoted": hasVoted,
			"userVote": userVote,
		})
	}
}

func DeleteVote(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var userVote VoteInfo
		err := json.NewDecoder(r.Body).Decode(&userVote)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if userVote.Option == "" {
			http.Error(w, "Option is required", http.StatusBadRequest)
			return
		}

		row, err := client.Votes.
			Query().
			Where(votes.PollID(userVote.PollID)).
			Only(context.Background())

		if err != nil {
			http.Error(w, "No such poll found", http.StatusBadRequest)
			return
		}

		votemap := row.Votes
		voteSlice := votemap[userVote.Option]

		for i, username := range voteSlice {
			if username == userVote.Username {
				voteSlice = append(voteSlice[:i], voteSlice[i+1:]...)
				break
			}
		}

		votemap[userVote.Option] = voteSlice

		_, err = row.Update().
			SetVotes(votemap).
			Save(context.Background())
		if err != nil {
			http.Error(w, "Failed to delete votes", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Vote deleted successfully"})
	}
}
