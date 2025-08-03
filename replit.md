# Overview

LucidQuant is a modern frontend-only React application built with Vite that serves as a platform for alternative investment signals and unconventional market analysis. The application features financial indicators sourced from TradingEconomics and specific market metrics including Promoter Holding Change, Bulk Dealings, Insider Activity, and Stock Trading Volume (with 50/200 day average toggle). Built with a sophisticated dark navy theme and teal accents, the platform provides detailed stock analysis tools and investment implications for each indicator and metric.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes (August 3, 2025)

✓ Updated indicators to reference real TradingEconomics data sources
✓ Implemented the four required metrics: Promoter Holding Change, Bulk Dealings, Insider Activity, Stock Trading Volume
✓ Added toggle functionality for Stock Trading Volume (50/200 day average)
✓ Enhanced stock analysis engine with realistic correlation data and beta values
✓ Improved investment implications with context-specific advice based on indicator/metric types
✓ Maintained Vite framework architecture for Vercel deployment compatibility

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark navy and teal color scheme
- **Build Tool**: Vite for fast development and optimized production builds
- **Typography**: Inter font family for modern, readable text

## Architecture Notes
- **Frontend-Only**: No backend dependencies, pure Vite React application for Vercel deployment
- **Data Sources**: Indicators reference TradingEconomics platform for authenticity
- **Analysis Engine**: Sophisticated stock analysis with realistic correlation data and investment implications
- **Toggle Functionality**: Stock Trading Volume metric includes 50/200 day average toggle feature
- **Enhanced UI**: Detailed analysis pages with investment implications and market context

## Component Structure
- **Page Components**: Home, Explore, Indicators, Metrics, and detail pages
- **UI Components**: Reusable shadcn/ui components (buttons, inputs, modals, etc.)
- **Layout Components**: Navbar, footer, and floating elements for visual enhancement
- **Data Components**: Static data structures for indicators and metrics with TypeScript interfaces

## Routing Strategy
- **Client-side Routing**: Wouter for lightweight routing without React Router overhead
- **Route Structure**: Clean URLs for main sections (/explore, /indicators, /metrics) and parameterized routes for details
- **Navigation**: Breadcrumb navigation and programmatic navigation using hooks

## Design System
- **Color Palette**: Navy primary background (#0a0e27) with teal accents (#14b8a6)
- **Animation**: CSS transitions and transforms for smooth interactions
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Accessibility**: Radix UI primitives ensure WCAG compliance

## Data Architecture
- **Static Data**: Indicators sourced from TradingEconomics covering VIX Fear Index, Baltic Dry Index, Consumer Confidence, etc.
- **Metrics Data**: Four key metrics - Promoter Holding Change, Bulk Dealings, Insider Activity, and Stock Trading Volume with toggle functionality
- **Stock Analysis**: Advanced analysis engine providing correlation scores, beta values, and activity recommendations
- **Type Safety**: Full TypeScript coverage with enhanced interfaces for toggles and analysis results

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless** - Neon PostgreSQL serverless database driver
- **drizzle-orm** - Type-safe SQL ORM for database operations
- **drizzle-kit** - Database migration and management tools

## Frontend Libraries
- **@tanstack/react-query** - Server state management and caching
- **wouter** - Lightweight routing library for React
- **@radix-ui/** (multiple packages) - Accessible UI primitives for components
- **class-variance-authority** - Utility for creating component variants
- **clsx** and **tailwind-merge** - Conditional styling utilities

## UI and Styling
- **tailwindcss** - Utility-first CSS framework
- **@hookform/resolvers** - Form validation integration
- **lucide-react** - Modern icon library
- **embla-carousel-react** - Carousel component library

## Development Tools
- **typescript** - Static type checking
- **vite** - Build tool and development server
- **@vitejs/plugin-react** - React support for Vite
- **@replit/vite-plugin-runtime-error-modal** - Development error handling
- **@replit/vite-plugin-cartographer** - Replit integration tools

## Database and Validation
- **drizzle-zod** - Zod integration for Drizzle schemas
- **zod** - Runtime type validation
- **connect-pg-simple** - PostgreSQL session store

## Utilities
- **date-fns** - Date manipulation library
- **cmdk** - Command palette component