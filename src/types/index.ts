export interface Menu {
  _id?: string
  name: string
  description?: string
  price?: number
  category?: string
  available?: boolean
  ingredients?: string[]
  allergens?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  error?: string
}