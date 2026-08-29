# OneSearchAPI

A GraphQL-powered backend service that aggregates and manages leads from multiple sources—YouTube channels, LinkedIn profiles, and Google Business listings. Users can search, filter, unlock, and manage lead data through an intuitive API with built-in authentication and credit-based access control.

## Overview

OneSearchAPI is designed for lead generation and management, enabling users to:
- Search and filter YouTube channels by location, subscriber count, and category
- Discover LinkedIn profiles by company, job title, and location
- Access Google Business listings by category and country
- Request specific lead data with status tracking
- Manage user credits and subscription tiers
- Leave reviews and ratings on lead data

## Stack

- **Language:** TypeScript (99%)
- **Framework:** NestJS 7.x
- **API:** GraphQL with Apollo Server
- **Database:** MySQL via TypeORM
- **Authentication:** Google OAuth 2.0 with JWT
- **Payments:** Stripe integration
- **Validation:** class-validator, class-transformer
- **Testing:** Jest

## Project Structure

```
src/
├── auth/              # Google OAuth, JWT strategies, token validation
├── user/              # User registration, profiles, access roles, reviews
├── youtube/           # YouTube channel data (bulk import, search, relationships)
├── google/            # Google Business listings (bulk import, search by filters)
├── linkedin/          # LinkedIn profiles (bulk import, search, unlock access)
├── profile/           # Extended user profile (credits, location, contact info)
├── payment/           # Payment records and Stripe integration
├── request/           # User data requests with category/platform/status filters
├── subscriptions/     # Subscription tier management
├── availability/      # Resource/staff availability tracking
├── config/            # Base entity definitions and app configuration
├── shared/            # Common guards and decorators
├── utils/             # Validation utilities
├── main.ts            # Application bootstrap
├── app.module.ts      # Root module with all imports
└── schema.gql         # Auto-generated GraphQL schema
```

## Key Modules

### Auth Module
- Google OAuth 2.0 authentication
- JWT token generation and validation
- Passport strategies for authentication flow

### User Module
- User registration and profile management
- Multiple access roles: Admin, Pro, Demo, Provider
- User reviews and ratings system
- Credit balance tracking

### Data Source Modules (YouTube, Google, LinkedIn)
Each module follows a consistent pattern:
- **Entity:** Database schema with audit fields (createdAt, updatedAt, createdBy, updatedBy)
- **Service:** Business logic for CRUD and search operations
- **Resolver:** GraphQL query and mutation endpoints
- **Repository:** TypeORM database access layer

### Payment & Subscriptions
- Credit purchase system via Stripe
- User credit deduction on lead unlock
- Subscription tier-based access control

## Getting Started

### Prerequisites
- Node.js 12+
- MySQL 5.7+
- npm or yarn

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=onesearch_db

# Server
PORT=5000

# Authentication
JWT_SECRET=your_jwt_secret
redirectURLAfterSignToken=http://localhost:3000/auth/callback?token=

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin
DEFAULT_ADMIN_EMAIL=admin@example.com

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Installation & Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run typeorm migration:run

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Development Commands

```bash
# Format code
npm run format

# Lint and fix
npm run lint

# Run tests
npm run test

# Watch mode tests
npm run test:watch

# Coverage report
npm run test:cov

# Debug tests
npm run test:debug

# E2E tests
npm run test:e2e
```

## GraphQL API

The GraphQL server runs at `http://localhost:5000/graphql` with Apollo Playground enabled.

### Example Queries

```graphql
# Get all YouTube channels
query {
  getAllChannels(data: { limit: 10, offset: 0, searchText: "tech" }) {
    channels {
      id
      channel_name
      subscribers
      location
    }
    totalCount
  }
}

# Get Google Business listings
query {
  getAllGoogleProfiles(data: { limit: 20, offset: 0, category: "restaurants", country: "USA" }) {
    profiles {
      id
      company
      category
      rating
      claim_status
    }
    totalCount
  }
}

# Get LinkedIn profiles
query {
  getLinkedinProfiles(data: { limit: 15, offset: 0, title: "CEO", company: "Google" }) {
    profiles {
      id
      fullName
      title
      company
      location
    }
    totalCount
  }
}

# Get current user
query {
  currentUser {
    id
    email
    firstName
    lastName
    accessRole
    availableCredits
  }
}
```

### Example Mutations

```graphql
# Register a new user via Google OAuth
mutation {
  createUser(input: {
    email: "user@example.com"
    firstName: "John"
    lastName: "Doe"
    avatarLink: "https://example.com/avatar.jpg"
    token: "google_oauth_token"
    authProvider: Google
  }) {
    id
    email
    accessRole
  }
}

# Bulk import YouTube channels
mutation {
  addYoutubeLeads(input: [{
    channel_name: "Tech Channel"
    channel_url: "https://youtube.com/channel/123"
    subscribers: 100000
    joined: "2020-01-01"
    location: "USA"
  }]) {
    id
    channel_name
  }
}

# Unlock LinkedIn profile access
mutation {
  unlockLinkedinLead(input: {
    userId: "user123"
    linkedinId: "linkedin456"
  }) {
    userId
    linkedinId
  }
}

# Add a user review
mutation {
  addUserReview(input: {
    id: "user123"
    rating: 4.5
    reviewText: "Great service!"
  }) {
    id
    rating
    reviewText
  }
}
```

## Database Schema

The application uses TypeORM with MySQL. Key entities:

- **User:** Core user account with OAuth info, access role, and credits
- **Profile:** Extended user profile (phone, city, country, credit balance)
- **Youtube:** YouTube channel metadata with bulk import capability
- **Google:** Google Business listings with category and country filters
- **Linkedin:** LinkedIn profiles with company, title, and location fields
- **Payment:** Payment transaction records
- **Request:** User-submitted data requests with status tracking

All entities include audit fields:
- `id` (UUID primary key)
- `createdAt` / `updatedAt` (timestamps)
- `createdBy` / `updatedBy` (audit trail)

## Authentication

### Google OAuth Flow

1. User initiates login via Google OAuth 2.0
2. Google returns authorization code
3. Backend exchanges code for access token
4. User created/retrieved in database
5. JWT token issued and signed with secret
6. Token returned via redirect URL with token parameter
7. Client stores JWT for subsequent GraphQL requests

### JWT Validation

All protected queries/mutations require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Access Roles

- **Admin:** Full system access, user management
- **Pro:** Premium features, extended credits
- **Demo:** Limited trial access with restricted credits
- **Provider:** Data provider role for bulk uploads

## Credits System

- Users have `availableCredits` tracked in the Profile entity
- Credits are deducted when unlocking lead data
- Credits can be purchased via Stripe integration
- Demo users receive limited credits for trial

## Deployment

### Heroku
The project includes a `Procfile` for Heroku deployment:

```
web: npm run start:prod
```

Set environment variables in Heroku Config Vars before deploying.

### Docker
(Optional) Create a Dockerfile and docker-compose.yml for containerized deployment.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Follow the code style (ESLint + Prettier configured)
3. Write tests for new functionality
4. Submit a pull request

## License

UNLICENSED

## Support

For issues and questions, please open a GitHub issue or contact the project maintainers.
