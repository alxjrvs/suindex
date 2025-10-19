# Salvage Union Data Viewer

A dynamic web application for viewing and exploring Salvage Union game data.

## Features

- **Dynamic Schema Loading**: Automatically reads all schemas from the `schemas/index.json` file
- **Auto-Discovery**: No code changes needed when new data files are added
- **Search**: Search items by name or description
- **Filtering**: Filter data by any field with multiple values
- **Sorting**: Click column headers to sort data
- **Detail View**: Click "View Details" to see all fields for any item
- **Responsive Design**: Clean, modern UI built with Tailwind CSS

## Getting Started

The app is available at `http://localhost:5173/` when running `npm run dev`.

## How It Works

The app uses symlinks in `public/` to access data and schemas from the parent directory.
It dynamically loads all schemas from `schemas/index.json` and generates the UI automatically.

When you add new data files, just update `schemas/index.json` and the app will pick them up automatically!
