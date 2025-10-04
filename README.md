# The Daily Menu API

A simple Express.js API with TypeScript that connects to MongoDB and provides endpoints for menu data.

## Project Structure

```
src/
├── index.ts          # Main Express server
├── lib/
│   └── mongodb.ts    # MongoDB connection utility
└── types/
    └── index.ts      # TypeScript type definitions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@the-daily-menu-cluster.cysyulp.mongodb.net/?retryWrites=true&w=majority&appName=the-daily-menu-cluster
```

Replace `<db_user>` and `<db_password>` with your actual MongoDB credentials.

## Development

Run locally:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### GET /health
Health check endpoint.

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/menus
Returns a list of all menus from the MongoDB collection.

Response:
```json
{
  "success": true,
  "data": [...],
  "count": 0
}
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `MONGODB_URI` with your connection string

## TypeScript

The project is fully typed with TypeScript:
- `Menu` interface for menu data structure
- `ApiResponse<T>` generic for consistent API responses
- Full type safety for MongoDB operations

Run type checking:
```bash
npm run type-check
```

Build for production:
```bash
npm run build
```
