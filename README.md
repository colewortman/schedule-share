# Schedule Share

A collaborative scheduling web application built to learn and practice modern full-stack development practices, testing, real-time collaboration, and cloud deployment.

**This project is still in development**

## Project Goals

This project is primarily a **learning platform** focused on:

- **Testing & Quality Assurance**: Automated testing with TypeScript and Jest
- **Real-time Collaboration**: WebSocket implementation for live schedule editing
- **Security Best Practices**: JWT authentication, secure password handling, and authorization
- **Cloud Infrastructure**: Containerization and deployment on AWS (ECS/EKS)
- **Professional Workflows**: CI/CD pipelines, monorepo management, and code quality tools

The goal is to build a production-quality application while gaining hands-on experience with industry-standard tools and patterns.

## Features

### Personal Schedules
- Create and manage your weekly schedule with time-blocked entries
- Define custom activity types (meetings, coding sessions, lunch breaks, etc.)
- Download and share your schedule with others
- Visual week-at-a-glance interface

### Group Collaboration
- Create groups and invite team members
- Build shared schedules collaboratively in real-time
- Role-based access control (admin/member)
- Import your personal schedule into group schedules
- Live updates when team members make changes (Google Docs-style collaboration)

### Data Management
- Conflict prevention (no overlapping schedule entries)
- Export schedules in multiple formats
- Persistent storage with PostgreSQL

## Tech Stack

### Frontend
- **Next.js** - React framework with SSR and API routes
- **React** - UI component library
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database with advanced constraint support

### Development & Quality
- **Jest** - Testing framework for unit and integration tests
- **ESLint** - Code linting and style enforcement
- **GitHub Actions** - CI/CD automation

### Planned Technologies
- **WebSockets** (Socket.io or native WebSockets) - Real-time collaboration
- **JWT** - Secure authentication and authorization
- **Docker/Kubernetes** - Application containerization
- **AWS ECS/EKS** - Cloud hosting (if cost-effective)

### Considering Technologies
- **MongoDB** - NoSQL document database for exploring alternative data modeling patterns
- **Redis** - In-memory data store for caching and real-time session management
- **Stripe** - Payment processing API for learning subscription-based monetization

## Project Structure

This is a **monorepo** containing both frontend and backend applications:

```
schedule-share/
├── apps/
│   ├── api/          # Backend Express server and database logic
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── web/          # Frontend Next.js application
│       ├── src/
│       ├── tests/
│       └── package.json
├── .github/
│   └── workflows/    # CI/CD pipeline definitions
└── README.md
```

## Database Schema

The application uses PostgreSQL with a normalized schema:

### Core Tables
- **users** - User accounts with authentication credentials
- **groups** - Collaborative groups for shared schedules
- **group_members** - Many-to-many relationship with role-based access
- **schedules** - Container for schedule entries (belongs to either a user OR a group)
- **activity_types** - Customizable activity categories
- **entries** - Individual time blocks with conflict prevention

### Key Features
- **UUID primary keys** for security and distributed systems compatibility
- **Exclusion constraints** using `btree_gist` to prevent overlapping schedule entries
- **CHECK constraints** to ensure data integrity (time ranges, day values, XOR relationship between user/group schedules)
- **Cascading deletes** to maintain referential integrity

See the full schema in `/apps/api/database/create-db.sql`

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/schedule-share.git
   cd schedule-share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create a PostgreSQL database
   createdb schedule_share
   
   # Run the schema
   psql schedule_share < apps/api/database/create-db.sql
   
   # (Optional) Load sample data
   psql schedule_share < apps/api/database/insert-db.sql
   ```

4. **Configure environment variables**
   
   Create `.env` files in both `apps/api/` and `apps/web/`:
   
   **apps/api/.env**
   ```env
   DB_USER="your postgres username"
   DB_HOST="localhost"
   DB_NAME="your databse name"
   DB_PASSWORD="your postgres password"
   DB_PORT="5432"
   ```
   
   **apps/web/.env**
   ```env
   (in-progress)
   ```

5. **Run the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or run individually
   npm run dev:api   # Backend on http://localhost:3001
   npm run dev:web   # Frontend on http://localhost:3000
   ```

## Testing

This project emphasizes test-driven development and code quality by using Jest for unit testing on each part of the project, and eslint to catch TypeScript errors.

## Learning Resources & References

### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing TypeScript with Jest](https://jestjs.io/docs/getting-started#using-typescript)

### WebSockets (Planned)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

### Authentication & Security (Planned)
- [JWT Introduction](https://jwt.io/introduction)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Containerization & Cloud (Planned)
- [Docker Documentation](https://docs.docker.com/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)

## CI/CD Pipeline

GitHub Actions automatically:
- Runs linting on all pull requests
- Executes the full test suite
- Checks for TypeScript compilation errors
- (Planned) Builds and deploys to staging/production environments

## Contributing

This is primarily a learning project, but suggestions and constructive feedback are welcome! If you're also learning and want to discuss approaches or best practices, feel free to open an issue.

## License

This project is open source and available under the [MIT License](LICENSE).
