#!/bin/bash

response=$(curl -s http://10.64.29.214/apps)

code=$(echo "$response" | grep -oP '"code":\K\d+')

if [ "$code" -eq 200 ]; then
  echo "Available Apps:"
  echo "$response" | grep -oP '"App_ID":\K\d+' | xargs -I {} echo "App ID: {}"
  echo "$response" | grep -oP '"App_Name":"\K[^"]+' | xargs -I {} echo "App Name: {}"
else
  echo "Failed to retrieve available apps"
  exit 1
fi

echo "Enter the App ID you want to register:"
read app_id

app_name=$(echo "$response" | grep -oP '"App_ID":'$app_id',"App_Name":"\K[^"]+')

if [ -z "$app_name" ]; then
  echo "Invalid App ID"
  exit 1
else
  echo "You are registering for: $app_name"
fi

echo "Enter the location:"
read location
echo "Enter the model number:"
read modelNumber

CPU=$(grep -c ^processor /proc/cpuinfo)
MEMORY=$(free -m | awk '/Mem:/ {print $2}')
DISK=""
rootVolume=$(df -h | awk '/\/$/ {print $1}')
hostName=$(hostname)
osVersion=$(cat /etc/redhat-release)

# Register server
response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"appId\": $app_id, \"CPU\": $cpu, \"MEMORY\": $memory, \"DISK\": \"$disk\", \"location\": \"$location\", \"modelNumber\": \"$model_number\", \"osVersion\": \"$os_version\", \"rootVolume\": \"$root_volume\", \"hostName\": \"$hostname\"}" http://10.64.29.214/server/register)

echo "Server registered for $app_name"
echo "Response: $response"
