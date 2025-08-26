package main

import (
	"context"
	"encoding/json"
	"net/http"
	"signIn/ent"
	"signIn/ent/polls"
	"signIn/ent/votes"

	"github.com/julienschmidt/httprouter"
)

func ListPolls(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		polls, err := client.Polls.
			Query().
			All(context.Background())

		if err != nil {
			http.Error(w, "Failed to ftch polls", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(polls)
	}
}

func CreatePoll(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var req PollInfo
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		if req.Title == "" || len(req.Options) == 0 {
			http.Error(w, "Title and options are required", http.StatusBadRequest)
			return
		}

		cl, err := client.Polls.
			Create().
			SetTitle(req.Title).
			SetOptions(req.Options).
			SetCreatedAt(req.CreatedAt).
			SetCreatedBy(req.CreatedBy).
			Save(context.Background())

		if err != nil {
			http.Error(w, "Failed to create poll", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(cl)
	}
}

func UpdatePoll(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var req PollInfo
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if req.Title == "" || len(req.Options) == 0 {
			http.Error(w, "Title and options are required", http.StatusBadRequest)
			return
		}

		poll, err := client.Polls.
			Query().
			Where(polls.ID(req.PollId)).
			Only(context.Background())

		if err != nil {
			http.Error(w, "Poll not found", http.StatusNotFound)
			return
		}

		poll.Update().
			SetTitle(req.Title).
			SetOptions(req.Options).
			SetCreatedAt(req.CreatedAt).
			SetCreatedBy(req.CreatedBy).
			Save(context.Background())

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(poll)
	}
}

func DeletePoll(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		var req PollInfo
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		_, err = client.Polls.
			Delete().
			Where(polls.ID(req.PollId)).
			Exec(context.Background())

		if err != nil {
			http.Error(w, "Failed to delete poll", http.StatusInternalServerError)
			return
		}

		_, err = client.Votes.
			Delete().
			Where(votes.PollID(req.PollId)).
			Exec(context.Background())

		if err != nil {
			http.Error(w, "Failed to delete votes", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Poll deleted successfully"))
	}
}
