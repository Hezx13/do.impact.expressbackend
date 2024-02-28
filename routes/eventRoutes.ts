import { Router } from "express";
import { Event } from "../db/models";
const eventRouter = Router();

eventRouter.get('/', async (req,res) =>{
    try{
        const eventList = await Event.find().lean();
        return res.status(200).json(eventList)
    } catch (err){
        console.error(err);
        return res.status(500).send('Internal server error');
    }
})

eventRouter.post('/',async (req,res) =>{
    try {
         const {
            name,
            title,
            speaker,
            description,
            summary,
            location,
            startTime,
            endTime,
            participants,
            visibility,
            category,
            price,
            materials
        } = req.body

        if (!name || !title || !location || !visibility || !category || !price){
            return res.status(400).send('Missing params')
        }   
    } catch (err) {

    }
})

export default eventRouter; 