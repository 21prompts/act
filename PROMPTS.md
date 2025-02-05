# Prompts

These prompts were used to create the "act" app, using Anthropic's Claude 3.5 Sonnet model via Github Copilot Chat plugin in Visual Studio Code.

## Prompt 1

We have been tasked with creating a new web app that can be easily self-hosted and used from browser on laptops, tablets and mobile phones. It will be used to create and fine tune their daily schedule as a daily task list from 00:00 till 23:59.

They want to have a checklist with a time when they want to start the task, such as "07:30", followed by name of the task, such as "Feed the cats". They also want to easily set the expected time it'll take them to complete the task. This will be shown after the task name in brackets such as (15min). They want this to be the main interface. Each day has its full list.

Swiping from left edge should display previous day's tasks now rearranged by the time each task was actually started and the time it actually took to finish (or default). For example: "07:00 - Feed the cats (20min)". They want to be able to swipe to previous days quickly to see when they actually get the work done, so they can tweak the schedules for coming days.

Swiping from right edge should display tasks set up for next day (and day after). These will follow the same format: "07:30 - Feed the cats (15min)" unless the user edits and changes it.

If the day being viewed is in future, tapping/clicking on task should allow inline editing. If day is today/current, long press will be required to edit as tapping will set the task as current in the bottom toolbar. If day is in past, tapping on it will allow inline editing.

The client wants to use this to track their daily schedule from morning till night. It will have the following components:

- fixed toolbar at top
  - menu button to toggle sidebar (left)
  - current day in the format "12:34 Tue, 5 Feb"
  - "+" button to add task (right)
  - "day-progress" widget
    - full-width progress bar at the bottom of the toolbar
    - begins at 00:00 and ends at 23:59
    - displays progress of the day using current time

- fixed toolbar at bottom
  - "task-progress" widget
    - full-width progress bar at top of the toolbar
    - uses list of today's tasks for total tasks
    - displays progress of tasks marked as done
  - current task
  - play/pause toggle button to track time doing a task
  - uses media api to present the play-pause and next button on the phone lock-screen along with the current task name

- tasks
  - the main content is a checklist of tasks for today
  - each task has a background color
    - light grey
      - task is not current
      - task is not completed
      - eta for task has not arrived
    - light blue
      - task is not current
      - task is not completed
      - eta for task has arrived
      - eta for next task has not arrived
    - blue
      - task is current
      - task is not completed
    - light green
      - task is completed
    - light yellow
      - task is not current
      - task is not completed
      - eta for starting next task is crossed
  - tapping on a task in "today" view will load the task in task toolbar at bottom as current task
  - long press on a task in today view will let user edit the task inline

We want to use markdown checklist files for daily templates (the user usually is on farm with farm-related work, but sometimes visits town for meeting people or grocery shopping and will have a different routing template for those days)

We will also be saving the day's progress as markdown checklists.

The markdown files will be stored in "data/" dir in cwd.

The app will be a go web server "server.go" written using gorilla/mux, that is started via cli "main.go". The UI is provided by index.html, app.css and app.js, served from "static/" dir. We want the client to be a PWA which can work offline and sync the markdown files with server. The server will expose API endpoints to sync files.

Take notes in <thinking></thinking> about the tasks that need to be done to set up this project, then populate "tasks.md" with the checklist that we will follow to implement this app.

## Prompt 2

Next, we want to set up the project structure:

- project root
  - main.go
  - server.go
  - tasks.go
  - static/
    - index.html
    - app.js
    - app.css
    - sw.js
    - manifest.json

Here, tasks.go will provide the API to manage tasks, parse and write markdown checklists etc.

We will ensure that refreshing cached PWA assets is possible from the sidebar via a "refresh" button.

Refer to tasks.md for what goes into each file.

## Prompt 3

Mark the tasks completed so far in tasks.md and then implement the remaining methods in "server.go"

### Prompt 3.1

server.go:118 declared and not used: path compiler UnusedVar

## Prompt 4

The templates for daily tasks will be in the format:

```
# Template Name

- [ ] 07:00 Feed the cats (15min)
- [ ] 07:30 Feed the dogs (20min)
- [ ] 08:00 Farm work
- [ ] 11:00 Cook food (1.5hr)
- [ ] 12:30 Lunch (30min)
- [ ] 14:00 Farm work
- [ ] 18:00 Feed the dogs (20min)
- [ ] 18:30 Feed the cats (15min)
```

Create a parser/write for this format, pay attention to how the ETA is formatted: "20min", "1.5hr" etc and that we are using 24 hour format with leading zero for when to start the task "07:00", "14:00" etc.

Consult tasks.md for specifics as discussed in initial prompt.

### Prompt 4.1

tasks.go:38 declared and not used: inTaskList compiler UnusedVar
