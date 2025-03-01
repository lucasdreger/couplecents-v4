# Welcome to Expense Empower

A comprehensive financial management platform designed for couples to manage shared finances with real-time collaboration.

## Project Overview

Expense Empower provides a unified dashboard for tracking income, expenses, investments, and savings reserves. The application is designed with a shared data model, ensuring that all users see the same financial data in real-time.

### Key Features

- **Shared Financial Dashboard**: A single source of truth for all financial data
- **Real-time Collaboration**: Multiple users can work simultaneously
- **Euro Currency Support**: Full support for € currency across all financial tracking
- **Responsive Design**: Optimized for both desktop and mobile use
- **Theme Support**: Toggle between light and dark modes for comfortable viewing
- **Four Financial Pillars**:
  - Income Tracking - Detailed recording of all income sources
  - Expense Management - Categorized tracking of both fixed and variable spending
  - Investment Monitoring - Long-term financial growth tracking
  - Reserve Building - Dedicated savings toward specific goals

## Recent Updates

### July 2023 Release

- **Enhanced Dashboard**: Completely redesigned dashboard with intuitive layout and improved data visualization
- **Investment & Reserves Integration**: Direct management of investments and reserves from the dashboard
- **Euro Currency Implementation**: Standardized all financial displays to use € symbol
- **Date Format Standardization**: All dates now display in DD/MM/YYYY format for consistency
- **Visual Improvements**: Updated color schemes, added shadows and gradients for better UX
- **UI Refinements**: Improved card layouts, better spacing, and more intuitive navigation
- **Fixed Expense Management**: Resolved issues with adding fixed expenses in the administration area
- **Monthly Expenses Default Year**: Changed default year to 2025 for better planning
- **Streamlined Navigation**: Simplified sidebar with more focused menu options

## Technical Implementation

The application uses a shared data model where all records are visible to all authenticated users. This is implemented through:

1. A unified database schema where records are not segregated by household
2. Real-time data synchronization using Supabase Realtime features
3. Collaborative UI components that update in real-time

### Architecture

Expense Empower is built with:

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with Shadcn UI components
- **State Management**: React Query for data fetching and caching
- **Backend**: Supabase for database, authentication, and real-time updates
- **Charts**: Recharts for data visualization

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` with your Supabase credentials
4. Run the development server: `npm run dev`
5. Apply database migrations: Run the SQL files in the `src/db` directory in your Supabase SQL editor

## Navigation Structure

- **Dashboard** - Comprehensive overview of financial data with integrated investment and reserve management
- **Monthly Expenses** - Month-by-month financial planning and tracking
- **Expenses** - Variable expenses tracking and management
- **Financial Analytics** - Advanced reporting and visualization
- **Administration** - System configuration, categories, and default values

## Future Development Plans

- **Mobile App**: Development of native mobile applications for iOS and Android
- **Export Functionality**: Ability to export financial data to CSV and PDF formats
- **Multi-currency Support**: Tracking investments and expenses in different currencies
- **Budget Templates**: Pre-defined budget templates for common scenarios
- **Goal Tracking**: Visual progress indicators for financial goals
- **Financial Forecasting**: Predictive analytics for future financial planning
- **Advanced Permissions**: More granular control over which users can view and edit specific data
- **Integration with Banking APIs**: Direct connection to banking data (subject to regulatory approval)

## Business Description

Expense Empower is a collaborative financial management platform specifically optimized for couples to manage shared finances. Unlike general budgeting apps, this system acknowledges the reality that couples often maintain both individual and shared financial responsibilities, requiring special tracking mechanisms.

### Core Financial Philosophy

The system is built around four key financial pillars:
- **Income Tracking** - Detailed recording of all household income sources with attribution
- **Expense Management** - Categorized tracking of both fixed recurring expenses and variable day-to-day spending
- **Investment Monitoring** - Long-term financial growth tracking with historical performance
- **Reserve Building** - Dedicated savings toward specific goals or emergency needs

### User Collaboration Model

- **Shared Visibility** - All users see identical financial information
- **Transparent Attribution** - System tracks which user created or modified each entry
- **Real-time Updates** - Changes propagate instantly to all active sessions
- **Activity History** - Maintains a detailed log of all financial activities with timestamps and user details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## How to Edit This Code

There are several ways to edit your application:

### Use Lovable
Simply visit the [Lovable Project](https://lovable.dev/projects/d22b273d-bf78-4296-9da9-11d4259891bf) and start prompting.
Changes made via Lovable will be committed automatically to this repo.

### Use your preferred IDE
If you want to work locally using your own IDE, you can clone this repo and push changes.

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

### Edit a file directly in GitHub
- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
