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

### Prompt 1.2

Let's review the chat history and set up day progress and any other missing features.


### Prompt 1.3

The day progress bar does not seem to be correct, it should update every minute automatically for current time. 

Also, let's remove the seconds display from current time. It is quite distracting.

## Prompt 2

Next let's focus on the buttons. Create a list of material-symbol icons that we can use for the buttons in mobile view to save space and write a /bin/sh script "fetch-icons.sh" to download them into the "static/icons/.." dir. The script will be run from project root.

### Prompt 2.1

Let's review the button layout and positions. The "Play/Pause" button should be next to the "Next" button.

## Prompt 3

Let's add placeholders for the weather icons through the day in 30 minute increments. Wire up the expand/ collapse button to hide any elements that don't have a task name.
Add 7 placeholder tasks between 08:00 and 17:00 for testing.

### Prompt 3.1

This is a mobile-first app as described in the initial prompt (see prompts.md), we want the tasks list to be a single column.

### Prompt 3.2

This works, but now we have broken the button styles.

### Prompt 3.3

We need to set up z-index for the toolbars at 500 to keep them above the task list.