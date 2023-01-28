package auth

import (
	"fmt"
	"log"
	"strings"

	"os"
	"os/exec"
	"os/signal"
	"os/user"

	"context"
	"net/http"
	"syscall"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

var key = "sk_test_BkPO9GSxRMKX7yp2aTtshIkQueomHQ9iuwXNBCI5HA"
var fileLoc string

func StartAuth() {
	go func() {
		cmd := exec.Command("/usr/bin/open", "https://red-pandas.vercel.app/approve")
		if err := cmd.Start(); err != nil {
			log.Fatal(err)
		}
	}()

	user, err := user.Current()
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("couldn't get user home directory")
		return
	}

	fileLoc = user.HomeDir + "/.redpandas"

	client, _ := clerk.NewClient(key)
	var srv http.Server
	srv.Addr = ":8080"
	srv.Handler = &AuthHandler{client}

	idle := make(chan struct{})
	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt)
		<-sigint

		if err := srv.Shutdown(context.Background()); err != nil {
			log.Printf("shutdown error %v", err)
		}
		close(idle)
	}()

	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("http serve: %v", err)
	}

	<-idle
}

func GetSessionInfo() []string {
	sessionTokenThenSessionID, err := os.ReadFile(fileLoc)
	if err != nil {
		log.Fatalf("couldn't get config file\n%v\n", err)
		return []string{}
	}

	combo := strings.Split(string(sessionTokenThenSessionID), "\n")
	if len(combo) != 2 {
		log.Fatalln("not enough data in config file")
	}
	return combo
}

type AuthHandler struct {
	client clerk.Client
}

func deleteFile() {
	if err := os.Remove(fileLoc); err != nil {
		log.Fatalln("couldn't delete old token file", err)
	}
}

func (a *AuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")

	claim, err := a.client.VerifyToken(token)
	if err != nil {
		fmt.Println(err.Error())
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("unauthorized"))
		return
	}

	clientUser, err := a.client.Users().Read(claim.Claims.Subject)
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("couldn't get user object")
		deleteFile()
		return
	}

	f, err := os.Create(fileLoc)
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("couldn't create config file")
		deleteFile()
		return
	}
	defer f.Close()

	// s := fmt.Sprintf("%s", token)
	s := fmt.Sprintf("%s\n%s", token, claim.SessionID)
	f.WriteString(string(s))

	w.Write([]byte("Welcome " + *clientUser.FirstName))
	syscall.Kill(syscall.Getpid(), syscall.SIGINT)
}
