import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import MongoDBConnection from './lib/MongoDBConnection'
import { Menu, ApiResponse } from './types'

const app: Application = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

const mongoConnection = MongoDBConnection.getInstance()

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: { 
      connected: mongoConnection.isConnectionActive() ,
    },
  })
})

// Menus endpoint
app.get('/api/menus', async (req: Request, res: Response<ApiResponse<Menu[]>>) => {
  try {
    const { db } = await mongoConnection.connect()
    const menus: Menu[] = await db.collection<Menu>('Menus').find({}).toArray()

    res.json({ success: true, data: menus, count: menus.length })
  } catch (error) {
    console.error('Error fetching menus:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch menus from database' })
  }
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

// Error handler
app.use((error: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', error)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await mongoConnection.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await mongoConnection.disconnect()
  process.exit(0)
})

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    // console.log(`MongoDB URI configured: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`)
  })
}

export default app
