# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d22b273d-bf78-4296-9da9-11d4259891bf

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d22b273d-bf78-4296-9da9-11d4259891bf) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d22b273d-bf78-4296-9da9-11d4259891bf) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# Expense Empower

A financial management platform designed for couples to manage shared finances.

## Architecture Overview

Expense Empower is built as a single shared workspace where all users see the same financial data in real-time. When any user updates an expense, income entry, or investment value, all other logged-in users will see these changes immediately.

### Key Features

- **Shared Financial Dashboard**: A single source of truth for all financial data
- **Real-time Collaboration**: Multiple users can work simultaneously
- **Theme Support**: Toggle between light and dark modes for comfortable viewing
- **Four Financial Pillars**:
  - Income Tracking - Detailed recording of all income sources
  - Expense Management - Categorized tracking of both fixed and variable spending
  - Investment Monitoring - Long-term financial growth tracking
  - Reserve Building - Dedicated savings toward specific goals

### Technical Implementation

The application uses a shared data model where all records are visible to all authenticated users. This is implemented through:

1. A unified database schema where records are not segregated by household
2. Real-time data synchronization using Supabase Realtime features
3. Collaborative UI components that update in real-time

### Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` with your Supabase credentials
4. Run the development server: `npm run dev`
5. Apply database migrations: Run the SQL files in the `src/db` directory in your Supabase SQL editor

### Database Schema

The database uses a shared model where all data is available to all authenticated users.

## Development

The application is built with:

- React / TypeScript
- Supabase for backend and authentication
- React Query for data fetching
- Shadcn UI for components

## Navigation Structure

- **Dashboard** - Overview of financial data
- **Expenses** - Consolidated expense management
  - Monthly Overview - Variable expenses tracking
  - Fixed Expenses - Recurring expenses management
  - Income - Income tracking and management
- **Investments** - Individual investment tracking and management
- **Reserves** - Savings reserves for specific goals
- **Administration** - System configuration and preferences

## Business description of the app
Expense Empower: Comprehensive Financial Management System
1. System Concept & Purpose
The Expense Empower system is designed as a collaborative financial management platform specifically optimized for couples to manage shared finances. Unlike general budgeting apps, this system acknowledges the reality that couples often maintain both individual and shared financial responsibilities, requiring special tracking mechanisms.

The fundamental architecture follows a "single source of truth" model where all users see the same financial data in real-time. When any user updates an expense, income entry, or investment value, all other logged-in users will see this change immediately without needing to refresh the page.

Core Financial Philosophy
The system is built around four key financial pillars:

Income Tracking - Detailed recording of all household income sources with attribution
Expense Management - Categorized tracking of both fixed recurring expenses and variable day-to-day spending
Investment Monitoring - Long-term financial growth tracking with historical performance
Reserve Building - Dedicated savings toward specific goals or emergency needs
User Collaboration Model
Shared Visibility - All users see identical financial information
Transparent Attribution - System tracks which user created or modified each entry
Real-time Updates - Changes propagate instantly to all active sessions
Activity History - Maintains a detailed log of all financial activities with timestamps and user details
