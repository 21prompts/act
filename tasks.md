# Instructions for Copilot

- Follow this checklist when implementing the project
- Do not modify the tasks unless asked to do so
- Never delete any task
- Do not remove these instructions

## Tasks

### Project Setup

- [ ] Initialize Go module
- [ ] Create directory structure (static/, data/)
- [ ] Set up basic Go server with gorilla/mux
- [ ] Create initial HTML/CSS/JS files

### Backend Development

- [ ] Implement file operations for markdown files
- [ ] Create API endpoints:
  - [ ] GET /api/tasks/{date} - Get tasks for date
  - [ ] POST /api/tasks/{date} - Save tasks for date
  - [ ] GET /api/templates - List available templates
  - [ ] GET /api/templates/{name} - Get specific template
- [ ] Add WebSocket support for real-time sync
- [ ] Implement template management

### Frontend Core

- [ ] Set up PWA manifest
- [ ] Implement service worker
  - [ ] Offline support
  - [ ] Background sync
- [ ] Create basic UI layout
  - [ ] Top toolbar with progress
  - [ ] Bottom toolbar with task controls
  - [ ] Main task list area

### UI Components

- [ ] Top Toolbar
  - [ ] Menu toggle button
  - [ ] Date display
  - [ ] Add task button
  - [ ] Day progress bar
- [ ] Bottom Toolbar
  - [ ] Task progress bar
  - [ ] Current task display
  - [ ] Play/pause controls
  - [ ] Media API integration
- [ ] Task List
  - [ ] Task item component
  - [ ] Task status colors
  - [ ] Inline editing
  - [ ] Gesture controls
- [ ] Menu
  - [ ] "Today" link to navigate to today's tasks
  - [ ] "Refresh" button to reload cached PWA assets

### Gestures & Interactions

- [ ] Implement swipe navigation
  - [ ] Left edge for previous day
  - [ ] Right edge for next day
- [ ] Task interactions
  - [ ] Tap to select (today view)
  - [ ] Long press to edit (today view)
  - [ ] Tap to edit (past/future)
- [ ] Progress tracking
  - [ ] Task completion
  - [ ] Time tracking

### Data Management

- [ ] Local storage implementation
- [ ] Sync mechanism with server
- [ ] Template management
- [ ] Task state management

### Testing & Optimization

- [ ] Unit tests for backend
- [ ] E2E tests for frontend
- [ ] Performance optimization
- [ ] Mobile responsiveness
