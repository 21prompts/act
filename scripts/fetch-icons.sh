#!/bin/bash

# Create icons directory structure
mkdir -p static/icons/filled static/icons/outlined static/icons/weather

# List of icons we need with both filled and outlined variants
ICONS=(
    "menu"              # Menu button
    "expand_all"       # Expand view
    "collapse_all"       # Collapse view
    "play_circle"       # Start timer
    "pause_circle"      # Pause timer
    "skip_next"         # Next task
)

# Download filled variants
for icon in "${ICONS[@]}"; do
    curl -s "https://raw.githubusercontent.com/marella/material-symbols/refs/heads/main/svg/500/rounded/${icon}.svg" \
        -o "static/icons/filled/${icon}.svg"
    echo "Downloaded filled ${icon}"
done

# Download outlined variants
for icon in "${ICONS[@]}"; do
    curl -s "https://raw.githubusercontent.com/marella/material-symbols/refs/heads/main/svg/500/outlined/${icon}.svg" \
        -o "static/icons/outlined/${icon}.svg"
    echo "Downloaded outlined ${icon}"
done


W_ICONS=(
    "01d"
    "02d"
    "03d"
    "04d"
    "09d"
    "10d"
    "11d"
    "13d"
    "50d"
    "01n"
    "02n"
    "03n"
    "04n"
    "09n"
    "10n"
    "11n"
    "13n"
    "50n"
)
# Download openweathermap icons
for icon in "${W_ICONS[@]}"; do
    curl -s "https://raw.githubusercontent.com/isneezy/open-weather-icons/refs/heads/master/src/svg/${icon}.svg" \
        -o "static/icons/weather/${icon}.svg"
    echo "Downloaded weather ${icon}"
done

echo "All icons downloaded successfully"
