# Prompts for Copilot

## Prompt 1

Let's create the scaffolding for a novel daily planner that includes hourly weather forecasts to help plan outdoor / indoor activities.

This will be a go lang project with html5, css3 and es2020. 

We want the following project structure:

- act/ (project root)
  - main.go
  - weather.go
  - tasks.go
  - static/
    - index.html
    - app.js
    - app.css

We will limit the number of files so it is possible to include everything in the chat context.
Do not create additional files.

For the interface we want the following structure:

- index.html
  - toolbar
    - fixed to top edge
    - contains
      - menu button
      - today's date and time
      - expand/collapse day view button
    - day progress bar
      - goes from 00:00:00 till 23:59:59
      - ful width, at bottom of toolbar
  - day view
    - column view with rows inside
    - each row contains
      - hour:minute in 30 minute sections
      - weather icon
      - task name
      - duration
    - use fixed grid ratios to ensure the content in rows aligns top to bottom
  - actionbar
    - fixed to bottom edge
    - contains
      - curent task name 
      - elapsed time
      - "Play/Pause" button to track time
      - "Next" button

For the backend we want the following data to be available through an api layer over go-sqlite:

- tasks
  - id
  - name
  - start time (optional)
  - duration (optional)
  - repeat (optional)
    - daily
    - weekly

- tasklog
  - date
  - name
  - start time (when the task was actually handled)
  - duration (actual time taken)
  - weather (weather data for the hour as json)

- weather
  - date
  - hour
  - data

For weather data we will use the openweathermap's onecall api (included in context). We will query the hourly forecasts once every 10 minutes and update the database.

We want debug logging for both backend and frontend that can be configured via a cli flag "--debug".

### Prompt 1.1

Use basic css reset and box-sizing to ensure the ui design is consistent.

Set up a colorful automatic light/dark theme with css variables and use a modern system-font stack.

Ensure the frontend is mobile-first, accessible and easy to read in harsh light.