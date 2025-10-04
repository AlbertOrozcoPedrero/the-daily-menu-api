// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Restaurant {
    constructor(
        public name: string,
        public coordinates: {
            latitude: number,
            longitude: number
        },
        public createdAt: Date,
        public updatedAt: Date,
        public id?: ObjectId
    ) {}
}