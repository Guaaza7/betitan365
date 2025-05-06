# Architecture Overview

## Overview

BetTitan365 is a sports betting platform built with a modern tech stack consisting of a React-based frontend and an Express.js backend. The application follows a client-server architecture with a RESTful API interface between them. It uses PostgreSQL (via Neon's serverless offering) for data storage, managed through Drizzle ORM, and implements user authentication with Passport.js.

## System Architecture

### High-Level Architecture

The application follows a three-tier architecture:

1. **Presentation Tier**: React-based single-page application with UI components from Shadcn/UI
2. **Application Tier**: Express.js server handling API requests, authentication, and business logic
3. **Data Tier**: PostgreSQL database (Neon serverless) with Drizzle ORM for data access

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│ Express Backend │────▶│  PostgreSQL DB  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend Architecture

The frontend is a React single-page application utilizing modern React patterns and UI components:

- Built with Vite for fast development and optimized builds
- Uses React Router (via Wouter) for client-side routing
- Implements TanStack Query for data fetching and caching
- Leverages Shadcn UI components built on Radix UI primitives
- Utilizes Tailwind CSS for styling
- Follows a component-based architecture with clear separation of concerns

### Backend Architecture

The backend is an Express.js server that provides RESTful API endpoints:

- Built with TypeScript for type safety
- Uses Passport.js for authentication and session management
- Implements middleware pattern for request processing
- Features structured routes for API organization
- Uses Drizzle ORM for database interaction
- Includes security features like CSRF protection and secure password handling

### Database Architecture

The application uses PostgreSQL (via Neon serverless) for data storage with Drizzle ORM for schema definition and migrations:

- Schema-defined entity relationships for users, bets, events, etc.
- Type-safe database interactions through Drizzle and Zod validation
- Well-defined relationships between entities using foreign keys
- Session storage in database using connect-pg-simple

## Key Components

### Frontend Components

1. **Pages**: React components that correspond to routes in the application
   - Home, Sports, Promotions, Auth, Account pages
   - Admin section with management interfaces

2. **UI Components**: Reusable UI elements built on Shadcn/UI and Radix UI
   - Buttons, Forms, Cards, Tables, etc.
   - Custom component extensions for specific business needs

3. **Hooks**: Custom React hooks for shared functionality
   - `useAuth`: Authentication state and methods
   - `useMobile`: Responsive design helper
   - `useToast`: Notification system

4. **Lib**: Utility functions and configurations
   - API request handling
   - Form validation with Zod
   - TanStack Query client setup

### Backend Components

1. **API Routes**: Express routes organized by resource
   - User-related endpoints (login, register, profile)
   - Betting-related endpoints (events, bets, transactions)
   - Admin endpoints for management functions

2. **Authentication**: Passport.js implementation
   - Local strategy for username/password
   - Session-based authentication
   - Password hashing with scrypt

3. **Storage**: Database interaction layer
   - Abstraction for data access
   - Transaction management
   - Entity-specific methods

4. **Middleware**: Request processing functions
   - Logging
   - Error handling
   - Authentication checks

### Database Schema

The database schema includes these primary entities:

1. **Users**: Account information and credentials
2. **User Stats**: Betting statistics for users
3. **Sport Categories**: Types of sports available for betting
4. **Events**: Sporting events available for betting
5. **Teams**: Sports teams participating in events
6. **Bets**: User bets on events
7. **Promotions**: Marketing promotions and bonuses
8. **Payment Transactions**: Financial transactions

## Data Flow

### Authentication Flow

1. User submits credentials via login form
2. Frontend sends credentials to `/api/login` endpoint
3. Backend verifies credentials with Passport.js
4. If valid, session is created and stored in database
5. User information is returned to frontend
6. Frontend stores authentication state in React context

### Betting Flow

1. User browses available events on frontend
2. User adds selections to bet slip
3. Frontend sends bet placement request to backend
4. Backend validates bet, checks user balance
5. If valid, bet is recorded and user balance updated
6. Confirmation is sent to frontend
7. Frontend updates UI to reflect new bet and balance

### Admin Management Flow

1. Admin users access management interfaces
2. Interfaces fetch data via admin-specific endpoints
3. Admin can view/edit events, users, bets, promotions
4. Changes are submitted to backend endpoints
5. Backend validates changes and updates database
6. Updated data is returned to frontend

## External Dependencies

### Frontend Dependencies

- **React**: UI library
- **TanStack Query**: Data fetching and state management
- **Wouter**: Routing
- **Shadcn/UI & Radix UI**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Schema validation
- **React Hook Form**: Form management

### Backend Dependencies

- **Express**: Web server framework
- **Passport.js**: Authentication middleware
- **Drizzle ORM**: Database ORM
- **Neon Database SDK**: Serverless PostgreSQL client
- **Connect-PG-Simple**: Session storage
- **Zod**: Schema validation

## Deployment Strategy

The application is configured to be deployed on Replit, as indicated by the `.replit` configuration file:

1. **Build Process**:
   - Frontend: Vite builds the React application
   - Backend: esbuild bundles the server code
   - Combined into a single deployable package

2. **Runtime Environment**:
   - Node.js 20 runtime
   - Environment variables for configuration
   - Production mode settings

3. **Database**:
   - Uses Neon's serverless PostgreSQL offering
   - Connected via DATABASE_URL environment variable
   - Database migrations applied during deployment

4. **Scaling Considerations**:
   - Stateless application design allows for horizontal scaling
   - Database is the primary stateful component
   - Session storage in database enables multi-instance deployments

5. **Security Measures**:
   - Secure session management
   - Password hashing with scrypt
   - HTTPS in production
   - Environment variable-based configuration

The application is designed to be deployed as a monolithic application where the frontend static assets are served by the Express backend.