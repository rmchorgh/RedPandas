package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

const (
	upload = "upload"
	help   = "help"
)

func main() {
	auth.startAuth()
	token := ""
	flag.Parse()
	args := flag.Args()
	op := args[0]

	if op == upload {
		path := args[1]

		file, err := os.Open(path)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer file.Close()

		response, err := http.Get("https://rp-cli-api-nhidc3zewa-uc.a.run.app/?file=hi.csv&token=" + token)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		defer response.Body.Close()

		if response.StatusCode != http.StatusOK {
			fmt.Println("Error:", response.Status)
			return
		}

		body, err := ioutil.ReadAll(response.Body)
		if err != nil {
			fmt.Println("Error:", err)
		}
		fmt.Println(string(body))

		request, err := http.NewRequest("PUT", string(body), file)
		if err != nil {
			fmt.Println(err)
			return
		}
		request.Header.Add("Content-Type", "text/csv")

		response, err = http.DefaultClient.Do(request)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer response.Body.Close()

		body, err = ioutil.ReadAll(response.Body)
		if err != nil {
			fmt.Println("Error:", err)
		}
		fmt.Println(string(body))

		if response.StatusCode != http.StatusOK {
			fmt.Println("Error:", response.Status)
			return
		}

		fmt.Println("File uploaded successfully!")

	} else if op == help {
		fmt.Println("Options:\n\t-upload: Upload File\n\t-help: Show Help")
	} else {
		fmt.Println("Invalid Input")
	}
}
