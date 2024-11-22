#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Step 1: Ensure the gh-pages branch exists
if ! git rev-parse --verify gh-pages >/dev/null 2>&1; then
    echo "Creating gh-pages branch..."
    git branch gh-pages
fi

# Step 2: Ensure all changes are committed
if [[ -n $(git status --porcelain) ]]; then
    echo "You have uncommitted changes. Please commit or stash them before deploying."
    exit 1
fi

# Step 3: Switch to gh-pages branch and merge main
echo "Switching to gh-pages branch and merging changes from main..."
git checkout gh-pages
git merge main --no-edit

# Step 4: Build the application
echo "Building the application..."
npm run build

# Step 5: Add the `dist` folder and commit changes
echo "Adding the 'dist' folder and committing changes..."
git add dist -f
git commit -m "Deployment commit" || echo "Nothing to commit."

# Step 6: Push to gh-pages branch
echo "Pushing the 'dist' folder to the gh-pages branch..."
git subtree push --prefix dist origin gh-pages

# Step 7: Switch back to main branch
echo "Switching back to the main branch..."
git checkout main

echo "Deployment completed successfully!"