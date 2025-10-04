// External Dependencies
import express, { Request, Response, NextFunction } from "express"
import { ObjectId } from "mongodb"
import Menu from "../models/Menu"
import MongoDBConnection from "../lib/MongoDBConnection"

// Global Config
const router = express.Router()
router.use(express.json())

const mongoConnection = MongoDBConnection.getInstance()

const getCollection = () => {
    const collections = mongoConnection.getCollections()
    const collection = collections.menus
    if (!collection) {
        throw new Error("Collection not found")
    }
    return collection
}

// todo: define response type? Response<ApiResponse<Menu[]>>

// GET (MANY)
router.get("/", async (req: Request, res: Response) => {
    try {
        const collection = getCollection()

        const results = await collection!.find<Menu>({}).toArray()
        res.json({
            success: true,
            data: results,
            count: results.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})

// GET (ONE)
router.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id
    if (!id) {
        return res.status(400).send("_id is required")
    }

    try {
        const collection = getCollection()

        const result = await collection!.findOne<Menu>({ _id: new ObjectId(id) })
        if (!result) return res.status(404)
        res.status(200).send({
            success: true,
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})

// POST
router.post("/", async (req: Request, res: Response) => {
    try {
        const collection = getCollection()

        const payload = req.body as Menu;
        const result = await collection!.insertOne(payload);

        result
            ? res.status(201).send({
                success: true,
                data: result,
                message: `Successfully created with id ${result.insertedId}`
            })
            : res.status(500).send({
                success: false,
                error: "Failed to create",
            });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
});

// PUT
router.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id
    if (!id) {
        return res.status(400).send("id is required")
    }

    try {
        const collection = getCollection()

        const payload = req.body as Menu;
        const query = { _id: new ObjectId(id) };

        const result = await collection!.updateOne(query, { $set: payload });

        result
            ? res.status(200).send({
                success: true,
                data: result,
                message: `Successfully updated with id ${id}`
            })
            : res.status(304).send({
                success: false,
                error: `id: ${id} not updated`,
            });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
});

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).send("id is required")
    }

    try {
        const collection = getCollection()

        const result = await collection!.deleteOne({ _id: new ObjectId(id) });

        if (result && result.deletedCount) {
            return res.status(202).send(`Successfully removed with id ${id}`);
        }
        if (!result) {
            return res.status(400).send(`Failed to remove with id ${id}`);
        }
        if (!result.deletedCount) {
            return res.status(404).send(`id ${id} does not exist`);
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
});

export default router;