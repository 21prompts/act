package main

import (
	"log"
	"time"
)

func fetchWeatherData() {
	for {
		// Fetch weather data from OpenWeatherMap API
		// Update the database with the new weather data
		if debug {
			log.Println("Weather data updated")
		}
		time.Sleep(10 * time.Minute)
	}
}

func init() {
	go fetchWeatherData()
}
