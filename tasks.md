# Instructions for Copilot

- Follow this checklist when implementing the project
- Do not modify the tasks unless asked to do so
- Never delete any task
- Do not remove these instructions

## Tasks

### Project Setup

- [x] Initialize Go module
- [x] Create directory structure (static/, data/)
- [x] Set up basic Go server with gorilla/mux
- [x] Create initial HTML/CSS/JS files

### Backend Development

- [x] Implement file operations for markdown files
- [x] Create API endpoints:
  - [x] GET /api/tasks/{date} - Get tasks for date
  - [x] POST /api/tasks/{date} - Save tasks for date
  - [x] GET /api/templates - List available templates
  - [x] GET /api/templates/{name} - Get specific template
- [x] Add WebSocket support for real-time sync
- [x] Implement template management

### Frontend Core

- [x] Set up PWA manifest
- [x] Implement service worker
  - [x] Offline support
  - [x] Background sync
- [x] Create basic UI layout
  - [x] Top toolbar with progress
  - [x] Bottom toolbar with task controls
  - [x] Main task list area

### UI Components

- [x] Top Toolbar
  - [x] Menu toggle button
  - [x] Date display
  - [x] Add task button
  - [x] Day progress bar
- [x] Bottom Toolbar
  - [x] Task progress bar
  - [x] Current task display
  - [x] Play/pause controls
  - [x] Media API integration
- [x] Task List
  - [x] Task item component
  - [x] Task status colors
  - [x] Inline editing
  - [x] Gesture controls
- [x] Menu
  - [x] "Today" link to navigate to today's tasks
  - [x] "Refresh" button to reload cached PWA assets

### Gestures & Interactions

- [x] Implement swipe navigation
  - [x] Left edge for previous day
  - [x] Right edge for next day
- [x] Task interactions
  - [x] Tap to select (today view)
  - [x] Long press to edit (today view)
  - [x] Tap to edit (past/future)
- [ ] Progress tracking
  - [x] Task completion
  - [ ] Time tracking

### Data Management

- [x] Local storage implementation
- [x] Sync mechanism with server
- [x] Template management
- [x] Task state management

### Testing & Optimization

- [ ] Unit tests for backend
- [ ] E2E tests for frontend
- [ ] Performance optimization
  - [ ] Add task duration tracking
  - [ ] Implement task timing statistics
  - [ ] Cache commonly used templates
- [x] Mobile responsiveness
