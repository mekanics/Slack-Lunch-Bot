# 🍔 Slack Lunch Bot

## How To Setup

### Google Maps Api key

[TODO]

### Code

- Update the coordinates and the radius

### Vercel

- deploy the app to vercel
- [TODO]

### Slack

- Go to https://api.slack.com/apps/ and create a new app
  - Pick a name and choose the workspace
  - Press 'Create app'
- In the section `Add features and functionality` go to `Slash Commands` and press `Create New Command`
  - Command: `/lunch`
  - Request Url: <your-vercel-app-url>/api
  - Short description: Choose a place to eat.
  - And 'Save'
- In the menu `OAuth & Permissions` go to `Scopes` and add `commands`
- Back on the `Basic Information` Page got to `Install your app` and press `Install to workspace`
