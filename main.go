package main

import (
	"flag"
	"log"
	"net/http"
	"os"
)

var debug bool

func main() {
	flag.BoolVar(&debug, "debug", false, "enable debug logging")
	flag.Parse()

	if debug {
		log.SetOutput(os.Stdout)
		log.Println("Debug mode enabled")
	} else {
		log.SetOutput(os.Stderr)
	}

	http.Handle("/", http.FileServer(http.Dir("./static")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
