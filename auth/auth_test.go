package auth

import (
	"fmt"
	"log"
	"os"
	"os/user"
	"strings"
	"testing"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

func TestAuth(t *testing.T) {
	StartAuth()
}

func TestVerify(t *testing.T) {
	user, err := user.Current()
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("couldn't get user home directory")
		return
	}

	sessionTokenThenSessionID, err := os.ReadFile(user.HomeDir + "/.redpandas")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("couldn't get config file")
		return
	}

	combo := strings.Split(string(sessionTokenThenSessionID), "\n")
	sessionToken := combo[0]
	sessionID := combo[1]

	client, _ := clerk.NewClient(key)
	ver, err := client.Sessions().Verify(sessionID, string(sessionToken))
	if err != nil {
		log.Fatalln(err)
	}

	log.Println(ver)
	log.Println(client.Sessions().ListAll())
}
