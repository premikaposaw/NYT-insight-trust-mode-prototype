# replit.md

## Overview

This is a fullstack JavaScript/TypeScript demo application showcasing a modern web development stack. The project demonstrates building RESTful APIs with Express.js on the backend and a React-based frontend with interactive API demos. It includes a question-answering system that processes text articles and provides cited responses.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite for development server and production builds

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Utility functions and API client in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful JSON APIs under `/api` routes
- **Build Process**: esbuild for production bundling with selective dependency bundling

The server structure:
- `server/index.ts` - Main entry point with Express setup and middleware
- `server/routes.ts` - API route definitions including article processing and Q&A endpoints
- `server/storage.ts` - In-memory storage abstraction (with interface for future database integration)
- `server/vite.ts` - Development server integration with Vite HMR
- `server/static.ts` - Production static file serving

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
- **Validation**: Zod schemas with drizzle-zod integration
- **Current Storage**: In-memory Map-based storage (MemStorage class)
- **Database Ready**: Drizzle config present for PostgreSQL migration when DATABASE_URL is provided

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- Database schema definitions
- TypeScript types and Zod validation schemas
- API response interfaces

### Build System
- Development: Vite dev server with HMR proxied through Express
- Production: Two-step build process via `script/build.ts`:
  1. Vite builds the client to `dist/public/`
  2. esbuild bundles the server to `dist/index.cjs` with selective dependency bundling

## External Dependencies

### Core Runtime
- **Node.js**: JavaScript runtime
- **PostgreSQL**: Database (optional, uses in-memory storage if DATABASE_URL not set)

### Key NPM Packages
- **Express**: Web server framework
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect
- **Vite**: Frontend build tool and dev server
- **React Query**: Data fetching and caching
- **Zod**: Runtime type validation

### UI/Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets

### Session Management
- **connect-pg-simple**: PostgreSQL session store (when database is connected)
- **express-session**: Session middleware

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Source mapping for Replit
- **@replit/vite-plugin-dev-banner**: Development environment indicator