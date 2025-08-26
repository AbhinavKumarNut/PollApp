package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"signIn/ent"

	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"gopkg.in/yaml.v3"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type cnf struct {
	Database struct {
		Host     string `yaml:"host"`
		Port     string `yaml:"port"`
		User     string `yaml:"user"`
		Password string `yaml:"password"`
		Database string `yaml:"database"`
	}
}

func main() {
	var cfg cnf
	yFile, err := os.ReadFile("config/config.yaml")
	if err != nil {
		log.Fatalf("Error reading YAML file: %s\n", err)
	}
	err = yaml.Unmarshal(yFile, &cfg)
	if err != nil {
		log.Fatalf("Error unmarshaling YAML: %s\n", err)
	}
	dsn := "postgres://" + cfg.Database.User + ":" + cfg.Database.Password + "@" + cfg.Database.Host + ":" + cfg.Database.Port + "/" + cfg.Database.Database + "?sslmode=disable"

	client, err := ent.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("failed to open connection: %v", err)
	}
	defer client.Close()
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}
	log.Println("Database connection successful!")

	router := httprouter.New()
	router.POST("/register", RegisterUser(client))
	router.POST("/login", LoginUser(client))
	router.POST("/newpoll", CreatePoll(client))
	router.GET("/polls", ListPolls(client))
	router.POST("/showvotes", ShowVotes(client))
	router.POST("/vote", CreateVote(client))
	router.POST("/deletevote", DeleteVote(client))
	router.POST("/updatepoll", UpdatePoll(client))
	router.GET("/vote/status", CheckVoteStatus(client))
	router.POST("/deletepoll", DeletePoll(client))
	http.ListenAndServe(":8080", enableCORS(router))
}
