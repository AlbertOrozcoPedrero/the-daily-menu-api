// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Plate {
    constructor(
        public name: string,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: ObjectId
    ) {}
}