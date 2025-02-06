#!/bin/bash

# Create icons directory structure
mkdir -p static/icons/filled static/icons/outlined

# List of icons we need with both filled and outlined variants
ICONS=(
    "menu"              # Menu button
    "expand_more"       # Expand view
    "expand_less"       # Collapse view
    "play_circle"       # Start timer
    "pause_circle"      # Pause timer
    "skip_next"         # Next task
    "wb_sunny"          # Weather - clear
    "cloud"            # Weather - cloudy
    "umbrella"         # Weather - rain
    "ac_unit"          # Weather - snow
    "thunderstorm"     # Weather - storm
)

# Download filled variants
for icon in "${ICONS[@]}"; do
    curl -s "https://fonts.gstatic.com/s/materialsymbolsrounded/v1/symbols/${icon}/fill1/48px.svg" \
        -o "static/icons/filled/${icon}.svg"
    echo "Downloaded filled ${icon}"
done

# Download outlined variants
for icon in "${ICONS[@]}"; do
    curl -s "https://fonts.gstatic.com/s/materialsymbolsrounded/v1/symbols/${icon}/outline1/48px.svg" \
        -o "static/icons/outlined/${icon}.svg"
    echo "Downloaded outlined ${icon}"
done

# Make script executable
chmod +x scripts/fetch-icons.sh

echo "All icons downloaded successfully"
