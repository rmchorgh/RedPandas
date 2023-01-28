package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/slowtacocar/RedPandas/auth"
)

const (
	Upload = "upload"
	Help   = "help"
)

func main() {
	flag.Parse()
	args := flag.Args()
	op := args[0]

	switch op {
	case Upload:
		auth.StartAuth()
		sessionTokenThenSessionID := auth.GetSessionInfo()
		sessionToken := sessionTokenThenSessionID[0]
		sessionID := sessionTokenThenSessionID[1]
		uploadFile(sessionToken, sessionID, args)
	case Help:
		usageHelp()
	default:
		fmt.Println("Invalid Input")
	}
}

func usageHelp() {
	fmt.Println("Options:\n\t-upload: Upload File\n\t-help: Show Help")
}

func uploadFile(token string, id string, args []string) {
	path := args[1]

	file, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	fsplit := strings.Split(path, "/")
	fmt.Printf("https://rp-cli-api-nhidc3zewa-uc.a.run.app/?file=%s&token=%s&id=%s", fsplit[len(fsplit)-1], token, id)
	url := fmt.Sprintf("https://rp-cli-api-nhidc3zewa-uc.a.run.app/?file=%s&token=%s&id=%s", fsplit[len(fsplit)-1], token, id)

	res, err := http.Get(url)
	if err != nil {
		fmt.Println("OH NO ERROR")
		log.Fatalln("Error:", err)
		return
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		fmt.Printf("\n[%s]\n", res.StatusCode)
		fmt.Println("\nOH NO ERROR1")
		log.Fatalln("Error:", res.Status)
		return
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("OH NO ERROR2")
		log.Fatalln("Error:", err)
	}
	fmt.Println(string(body))

	req, err := http.NewRequest("PUT", string(body), file)
	if err != nil {
		fmt.Println("OH NO ERROR3")
		log.Fatalln("Error:", err)
		return
	}
	req.Header.Add("Content-Type", "text/csv")

	res, err = http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("OH NO ERROR4")
		log.Fatalln("Error:", err)
		return
	}
	defer res.Body.Close()

	_, err = io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("OH NO ERROR5")
		log.Fatalln("Error:", err)
		return
	}

	if res.StatusCode != http.StatusOK {
		fmt.Println("OH NO ERROR6")
		log.Fatalln("Error:", res.Status)
		return
	}

	fmt.Println("File uploaded successfully!")
}
