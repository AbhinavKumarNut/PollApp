package main

import (
	"context"
	"encoding/json"
	"net/http"
	"signIn/ent"
	"signIn/ent/user"

	"github.com/julienschmidt/httprouter"
)

func RegisterUser(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var req RegisterInfo
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"message": "Invalid request body"})
			return
		}

		if req.Username == "" || req.Password == "" || req.Email == "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"message": "All fields are required"})
			return
		}

		_, err = client.User.
			Create().
			SetUsername(req.Username).
			SetEmail(req.Email).
			SetPassword(req.Password).
			Save(context.Background())

		if err != nil {
			if ent.IsConstraintError(err) {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusConflict)
				json.NewEncoder(w).Encode(map[string]string{"message": "Username already exists"})
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"message": "Failed to create user"})
			return
		}
	}
}

func LoginUser(client *ent.Client) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		var req LoginInfo
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		user, err := client.User.
			Query().
			Where(user.Username(req.Username)).
			Only(context.Background())

		if err != nil || user.Password != req.Password {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"message": "Invalid username or password"})
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
	}
}
