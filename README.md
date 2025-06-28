# ExpenseApp

This React Native (Expo) project allows daily expense entry and reporting using a local SQLite database. It also provides a simple sync script to push/pull the database file to a private GitHub repository.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- A private GitHub repository and personal access token for syncing

## Setup

```bash
cd ExpenseApp
npm install
```

## Running

```bash
npm start           # start Expo
npm run android     # run on Android
npm run ios         # run on iOS
```

## Syncing Database

Set environment variables `GH_TOKEN` (GitHub token) and `GH_REPO` (`owner/repo`). Then run:

```bash
node sync.js push   # upload expenses.sqlite to repo
node sync.js pull   # download expenses.sqlite from repo
```

The script updates `expenses.sqlite` in the repository using the GitHub Contents API.
