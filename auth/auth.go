package auth

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"os/user"

	"context"
	"net/http"
	"syscall"
)

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

	var srv http.Server
	srv.Addr = ":8080"
	srv.Handler = &AuthHandler{}

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

func GetSessionInfo() string {
	token, err := os.ReadFile(fileLoc)
	if err != nil {
		log.Fatalf("couldn't get config file\n%v\n", err)
		return ""
	}

	return string(token)
}

type AuthHandler struct {
}

func deleteFile() {
	if err := os.Remove(fileLoc); err != nil {
		log.Fatalln("couldn't delete old token file", err)
	}
}

func (a *AuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token != "" {
		f, err := os.Create(fileLoc)
		if err != nil {
			fmt.Println(err.Error())
			fmt.Println("couldn't create config file")
			deleteFile()
			return
		}
		defer f.Close()

		f.WriteString(token)
		f.Sync()

		w.Write([]byte("Welcome to RedPandas! You can close this window now and return to the terminal."))
		syscall.Kill(syscall.Getpid(), syscall.SIGINT)
	}
}
