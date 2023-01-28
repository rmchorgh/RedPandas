package main

import (
    "fmt"
    "log"
    
    "os"
    "os/signal"
    "os/user"
    "os/exec"

    "net/http"
    "syscall"
    "context"

    "github.com/clerkinc/clerk-sdk-go/clerk"
)

func main() {
    go func() {
        cmd := exec.Command("/usr/bin/open", "https://red-pandas.vercel.app/approve")
        if err := cmd.Start(); err != nil {
            log.Fatal(err)
        }
    }()

    key := "sk_test_BkPO9GSxRMKX7yp2aTtshIkQueomHQ9iuwXNBCI5HA"
    client, _ := clerk.NewClient(key)
    var srv http.Server
    srv.Addr = ":8080"
    srv.Handler = &AuthHandler{ client }

    idle := make(chan struct {})
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

type AuthHandler struct {
    client clerk.Client
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
        return
    }

    user, err := user.Current()
    if err != nil {
        fmt.Println(err.Error())
        fmt.Println("couldn't get user home directory")
        return
    }

    f, err := os.Create(user.HomeDir + "/.redpandas")
    if err != nil {
        fmt.Println(err.Error())
        fmt.Println("couldn't create config file")
        return
    }
    defer f.Close()

    s := fmt.Sprintf("%s\n%s", token, clientUser.ID)
    f.WriteString(string(s))

    w.Write([]byte("Welcome " + *clientUser.FirstName))
    syscall.Kill(syscall.Getpid(), syscall.SIGINT)
    return
}
