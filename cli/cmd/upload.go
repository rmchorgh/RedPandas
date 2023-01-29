package cmd

import (
	"encoding/json"
	"fmt"
	"github.com/slowtacocar/RedPandas/auth"
	"github.com/spf13/cobra"
	"io"
	"log"
	"net/http"
	"os"
)

type Response struct {
	URL       string `json:"url"`
	DatasetID string `json:"datasetId"`
}

var uploadCmd = &cobra.Command{
	Use:   "upload [file path]",
	Short: "RedPanda Command Line Utility",
	Long: `To upload a file for use with RedPanda, try running a command like:
rp upload [file path]`,
	Args: cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		auth.StartAuth()
		token := auth.GetSessionInfo()

		path := args[0]

		file, err := os.Open(path)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer file.Close()

		url := fmt.Sprintf("https://rp-cli-api-nhidc3zewa-uc.a.run.app/?token=%s", token)

		res, err := http.Get(url)
		if err != nil {
			log.Fatalln("Error:", err)
			return
		}
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			log.Fatalln("Error:", res.Status)
			return
		}

		body, err := io.ReadAll(res.Body)
		if err != nil {
			log.Fatalln("Error:", err)
		}
		var result Response
		if err := json.Unmarshal(body, &result); err != nil {
			log.Fatalln(err)
		}

		req, err := http.NewRequest("PUT", result.URL, file)
		if err != nil {
			log.Fatalln("Error:", err)
			return
		}
		req.Header.Add("Content-Type", "text/csv")

		res, err = http.DefaultClient.Do(req)
		if err != nil {
			log.Fatalln("Error:", err)
			return
		}
		defer res.Body.Close()

		_, err = io.ReadAll(res.Body)
		if err != nil {
			log.Fatalln("Error:", err)
			return
		}

		if res.StatusCode != http.StatusOK {
			log.Fatalln("Error:", res.Status)
			return
		}

		fmt.Println("File uploaded successfully! Use the following values to use this dataset:")
		fmt.Printf("Dataset ID: %s\n", result.DatasetID)
	},
}

func init() {
	rootCmd.AddCommand(uploadCmd)
}
