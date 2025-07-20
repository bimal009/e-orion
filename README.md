# E-Orion

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [API & Server Actions](#api--server-actions)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database & Migrations](#database--migrations)
- [Usage Guide](#usage-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Known Limitations & Roadmap](#known-limitations--roadmap)
- [License](#license)
- [Contact](#contact)

---

## Project Overview
E-Orion is a modern web application for managing tournaments, teams, rounds, groups, and matches. Built with Next.js, it provides a robust dashboard for authenticated users to create, view, and manage all aspects of competitive events, including team rosters, match schedules, and more. The app features secure authentication, image uploads, and a responsive, user-friendly UI.

## Features
- User authentication (sign in, sign up) via NextAuth.js
- Tournament creation, editing, and deletion
- Team and group management (CRUD)
- Round and match scheduling
- Player management within teams
- Dashboard with detailed, filterable views
- Image uploads (Cloudinary integration)
- Responsive UI with dark mode
- Role-based access and protected routes
- Modern UI components (Radix UI, TailwindCSS)

## Tech Stack
- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript 5
- **Database:** MongoDB (via Prisma ORM)
- **Authentication:** NextAuth.js with Prisma Adapter
- **Cloud Storage:** Cloudinary (via next-cloudinary)
- **Styling:** TailwindCSS 4, CSS Modules, tw-animate-css
- **UI Components:** Radix UI, Lucide React Icons
- **State/Data:** React Query (TanStack), Zod (validation)
- **Forms:** React Hook Form, @hookform/resolvers
- **Other:**
  - Custom React hooks
  - Sonner (notifications)
  - Class variance authority, clsx (utility)
  - Next Themes (dark mode)
  - Prisma for migrations and type safety

#### Major Packages
```
next, react, next-auth, @prisma/client, prisma, next-cloudinary, tailwindcss, @radix-ui/*, @tanstack/react-query, react-hook-form, zod, lucide-react, sonner, next-themes, tw-animate-css, @hookform/resolvers, class-variance-authority, clsx
```

## Folder Structure
```
e-orion/
├── app/                # Main application pages and API routes
│   ├── (auth)/         # Authentication pages (sign in, sign up)
│   ├── (root)/         # Main app pages (about, contact, dashboard, etc.)
│   ├── api/            # API routes (auth, images)
│   └── globals.css     # Global styles (Tailwind, custom props)
├── components/         # Reusable UI and dashboard components
│   ├── dashboard/      # Dashboard-specific components (actions, forms, lists)
│   ├── shared/         # Shared UI components (Navbar, Footer, etc.)
│   └── ui/             # UI primitives (Button, Card, etc.)
├── lib/                # Utility libraries and hooks
│   ├── hooks/          # Custom React hooks
│   ├── providers/      # Context providers
│   └── prisma.ts       # Prisma client setup
├── prisma/             # Prisma schema
├── public/             # Static assets (images, SVGs)
├── middleware.ts       # Next.js middleware (auth protection)
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## API & Server Actions
### Authentication
- **`/api/auth/[...nextauth]`**: Handles all authentication (sign in, sign out, session, callbacks) via NextAuth.js. Uses Prisma Adapter for MongoDB.

### Image Uploads & Bulk Data
- **`/api/images`**: (GET) Bulk inserts dummy teams and players for testing/demo purposes. Requires authentication.

### Dashboard Server Actions (via React Server Actions)
- **Tournaments**
  - `createTournment(data)`: Create a new tournament
  - `updateTournment(id, data)`: Update tournament details
  - `getTournaments()`: List tournaments for the current user
  - `getTournamentsWithSearch(search)`: Search tournaments by name
  - `deleteTournament(id)`: Delete a tournament
- **Rounds**
  - `createRound(data)`, `updateRound(id, data)`, `getRounds(tournamentId)`, `getRoundsWithSearch(tournamentId, search)`, `deleteRound(id)`
- **Teams**
  - `createTeam(data)`, `updateTeam(id, data)`, `getTeams(tournamentId)`, `getTeamsWithPagination(tournamentId, page, limit)`, `getTeamsWithSearch(tournamentId, search)`, `deleteTeam(id)`, `getTeamById(id)`
- **Groups**
  - `createGroup(data)`, `updateGroup(id, data)`, `getGroups(tournamentId)`, `getGroupsWithSearch(tournamentId, search)`, `deleteGroup(id)`, `getGroupById(id)`, `getGroupsByRoundId(tournamentId, roundId)`
- **Games/Matches**
  - `createMatch(data)`, `updateTeam(id, data)`, `getTeams(tournamentId)`, `getTeamsWithSearch(tournamentId, search)`, `deleteTeam(id)`, `getTeamById(id)`
- **Maps**
  - `getMaps()`: List all maps with related matches

> All server actions require authentication and are protected by middleware.

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd e-orion
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` (create if missing) and fill in the following:

## Environment Variables
| Variable                | Description                        |
|-------------------------|------------------------------------|
| `MONGODB_URI`           | MongoDB connection string           |
| `NEXTAUTH_URL`          | Your app URL (e.g. http://localhost:3000) |
| `NEXTAUTH_SECRET`       | Secret for NextAuth session         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name               |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                  |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret               |

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   # or, for MongoDB, use:
   npx prisma db push
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```
6. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Database & Migrations
- Uses **Prisma ORM** with MongoDB.
- Schema defined in `prisma/schema.prisma`.
- Run migrations with `npx prisma migrate dev` (for SQL) or `npx prisma db push` (for MongoDB).
- Seed data can be added via custom scripts or the `/api/images` endpoint for demo teams/players.

## Usage Guide
### Authentication & Access
- Sign up or sign in to access the dashboard (protected by middleware).
- Authenticated users are redirected to `/dashboard`.

### Dashboard Features
- **Tournaments:** Create, edit, delete, and view tournaments. Each tournament can have custom branding (colors, logo).
- **Teams:** Add teams to tournaments, manage rosters (players), edit team info, and assign to groups/rounds.
- **Groups:** Organize teams into groups for group-stage play. Assign/remove teams from groups.
- **Rounds:** Schedule rounds for tournaments, assign teams/groups, and manage match days.
- **Matches:** Schedule matches, assign teams, set times, and link to maps.
- **Maps:** Manage and assign maps to matches.
- **Image Uploads:** Upload team logos and assets via Cloudinary integration.

### Example: Creating a Tournament
1. Sign in and go to the dashboard.
2. Click "Create Tournament" and fill in the form (name, logo, colors).
3. Add teams, rounds, groups, and matches as needed.
4. Use the dashboard to filter/search and manage all entities.

## Testing
- **Linting:**
  ```bash
  npm run lint
  ```
- **Unit/Integration Tests:**
  > _No dedicated test suite yet. PRs for tests are welcome!_
- **Manual Testing:**
  - Use the dashboard UI to test all CRUD operations.
  - Use `/api/images` to bulk insert demo data for testing.

## Deployment
- **Vercel** is recommended for deployment (Next.js optimized).
- Set all environment variables in your Vercel dashboard.
- Ensure your MongoDB and Cloudinary credentials are production-ready.
- Run `npm run build` and `npm start` for production.

## Contributing
We welcome contributions! Please follow these guidelines:

### Workflow
1. Fork the repository
2. Create a new branch (`feature/your-feature` or `fix/your-bug`)
3. Commit with clear, descriptive messages
4. Ensure code passes linting (`npm run lint`)
5. Open a pull request (PR) with a clear description
6. Reference any related issues in your PR

### Code Style
- Use TypeScript and follow existing patterns
- Use Prettier and ESLint (if configured)
- Prefer functional components and hooks
- Keep components modular and reusable

### Testing
- Manual testing is required for all new features
- Automated tests (Jest/React Testing Library) are planned for future versions

## Known Limitations & Roadmap
### Limitations
- No automated test suite (yet)
- No admin/user roles beyond basic authentication
- No email notifications or advanced user management
- Limited analytics and reporting

### Roadmap
- Add automated tests (unit/integration)
- Role-based access control (admin, organizer, player)
- Email notifications and invites
- Public tournament pages and sharing
- Improved analytics and dashboards
- Mobile app version

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact
- **Author:** Bimal
- **Email:** [your-email@example.com]
- **GitHub:** [your-github-profile]
- For questions, issues, or feature requests, please open an issue on GitHub.

