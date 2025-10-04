import { MongoClient, Db, Collection } from 'mongodb'

export interface DatabaseConnection {
  client: MongoClient
  db: Db
}

export default class MongoDBConnection {
  private static instance: MongoDBConnection
  private client: MongoClient | null = null
  private db: Db | null = null
  private isConnected: boolean = false
  private collections: {
    menus?: Collection
  } = {}

  private constructor() {
    this.collections = {}
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection()
    }
    return MongoDBConnection.instance
  }

  public async connect(): Promise<DatabaseConnection> {
    if (this.isConnected && this.client && this.db) {
      return { client: this.client, db: this.db }
    }

    const uri = process.env.MONGODB_URI
    const dbName = process.env.MONGODB_DB_NAME
    
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable')
    }

    if (!dbName) {
      throw new Error('Please define the MONGODB_DB_NAME environment variable')
    }

    try {
      this.client = new MongoClient(uri)

      await this.client.connect()

      this.db = this.client.db(dbName)

      this.collections.menus = this.db.collection("Menus");

      this.isConnected = true

      console.log('Successfully connected to MongoDB')
      
      return { client: this.client, db: this.db }
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      this.isConnected = false      
      throw error
    }
  }

  public getCollections() {
    return this.collections
  }

  public async disconnect(): Promise<void> {
    if (!this.client) return
    await this.client.close()
    this.client = null
    this.db = null
    this.isConnected = false
    console.log('Successfully disconnected from MongoDB')
  }

  public isConnectionActive(): boolean {
    return this.isConnected && this.client !== null
  }
}
