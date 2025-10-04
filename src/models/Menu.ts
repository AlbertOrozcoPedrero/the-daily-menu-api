// External dependencies
import { ObjectId } from "mongodb";
import Restaurant from "./Restaurant";
import Plate from "./Plate";
import Drink from "./Drink";

// Class Implementation
export default class Menu {
    constructor(
        public restaurant: Restaurant,
        public starters: Plate[],
        public mains: Plate[],
        public desserts: Plate[],
        public drinks: Drink[],
        public includesBread: boolean,
        public dessertOrCoffee: boolean,
        public price: number,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: ObjectId
    ) { }
}