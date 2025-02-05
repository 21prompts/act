package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

type Task struct {
	Time     string `json:"time"`
	Name     string `json:"name"`
	Duration string `json:"duration"`
	Done     bool   `json:"done"`
	Current  bool   `json:"current"`
}

type TaskManager struct {
	dataDir string
}

func NewTaskManager(dataDir string) (*TaskManager, error) {
	return &TaskManager{dataDir: dataDir}, nil
}

var (
	taskLineRegex = regexp.MustCompile(`^- \[([ x])\] (\d{2}:\d{2}) (.+?)(?: \((.+?)\))?$`)
	timeRegex     = regexp.MustCompile(`^\d{2}:\d{2}$`)
	durationRegex = regexp.MustCompile(`^(?:\d+|\d+\.\d+)(?:min|hr)$`)
)

func parseTasksFromMarkdown(content string) ([]Task, error) {
	var tasks []Task
	scanner := bufio.NewScanner(strings.NewReader(content))

	for scanner.Scan() {
		line := scanner.Text()

		// Skip empty lines and headers
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		// Parse task line
		matches := taskLineRegex.FindStringSubmatch(line)
		if matches == nil {
			continue
		}

		// Extract components
		done := matches[1] == "x"
		time := matches[2]
		name := matches[3]
		duration := matches[4]

		// Validate time format
		if !timeRegex.MatchString(time) {
			return nil, fmt.Errorf("invalid time format: %s", time)
		}

		// Validate duration format if present
		if duration != "" && !durationRegex.MatchString(duration) {
			return nil, fmt.Errorf("invalid duration format: %s", duration)
		}

		tasks = append(tasks, Task{
			Time:     time,
			Name:     name,
			Duration: duration,
			Done:     done,
			Current:  false,
		})
	}

	return tasks, scanner.Err()
}

func formatTasksAsMarkdown(tasks []Task) string {
	var sb strings.Builder

	for _, task := range tasks {
		// Format checkbox
		checkmark := " "
		if task.Done {
			checkmark = "x"
		}

		// Format duration
		duration := ""
		if task.Duration != "" {
			duration = fmt.Sprintf(" (%s)", task.Duration)
		}

		// Write task line
		fmt.Fprintf(&sb, "- [%s] %s %s%s\n", checkmark, task.Time, task.Name, duration)
	}

	return sb.String()
}

func (tm *TaskManager) GetTasksForDate(date string) ([]Task, error) {
	path := filepath.Join(tm.dataDir, date+".md")
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return []Task{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("reading tasks: %w", err)
	}
	return parseTasksFromMarkdown(string(data))
}

func (tm *TaskManager) SaveTasksForDate(date string, tasks []Task) error {
	// Sort tasks by time before saving
	sort.Slice(tasks, func(i, j int) bool {
		return tasks[i].Time < tasks[j].Time
	})

	path := filepath.Join(tm.dataDir, date+".md")
	data := formatTasksAsMarkdown(tasks)
	return os.WriteFile(path, []byte(data), 0644)
}
