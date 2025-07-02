#!/bin/bash

# LinkedIn Profile Update Script
# Usage: ./update-linkedin.sh YOUR-ACTUAL-USERNAME

if [ -z "$1" ]; then
    echo "Usage: ./update-linkedin.sh YOUR-LINKEDIN-USERNAME"
    echo "Example: ./update-linkedin.sh jaytarzwell"
    exit 1
fi

LINKEDIN_USERNAME=$1

echo "Updating LinkedIn links to: https://linkedin.com/in/$LINKEDIN_USERNAME"

# Update all HTML files
sed -i '' "s|YOUR-LINKEDIN-PROFILE|$LINKEDIN_USERNAME|g" home-new.html
sed -i '' "s|YOUR-LINKEDIN-PROFILE|$LINKEDIN_USERNAME|g" about.html
sed -i '' "s|YOUR-LINKEDIN-PROFILE|$LINKEDIN_USERNAME|g" books.html
sed -i '' "s|YOUR-LINKEDIN-PROFILE|$LINKEDIN_USERNAME|g" writings.html

echo "LinkedIn links updated successfully!"
echo "Don't forget to add your profile photo to: images/jay-tarzwell-photo.jpg"