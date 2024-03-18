import { Request, Response, Router } from "express";
import { Event } from "../db/models";
import { authMiddleware } from './middleware';
import LogRoute from '../utils/decorators';

class EventController {
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getEventList.bind(this));
        this.router.post('/',authMiddleware, this.addEvent.bind(this));
        this.router.get('/:eventId', authMiddleware, this.getEvent.bind(this));
        this.router.get('/short', this.getEventsShortList.bind(this));
      }
    @LogRoute('HTTP Request event')
    async getEventList(req: Request,res: Response){
        try{
            const eventList = await Event.find().lean();
            return res.status(200).json(eventList)
        } catch (err){
            console.error(err);
            return res.status(500).send('Internal server error');
        }
    }

    @LogRoute('HTTP Request event')
    async getEvent(req: Request, res: Response) {
        const { eventId } = req.params;
        if (!eventId) return res.status(400).send('Bad request');
        try {
            const event = await Event.findById(req.params.eventId).lean();
            return res.status(200).json(event);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
    }

    @LogRoute('HTTP Request event')
    async getEventsShortList(req: Request, res: Response) {
        try {
            const events = await Event.find().select(['name', 'title','summary', 'location','startTime', 'endTime', 'price']);
            return res.status(200).json(events)
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
    }

    @LogRoute('HTTP Request event')
    async addEvent(req: Request,res: Response){
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
                    visibility,
                    category,
                    tags,
                    price,
                } = req.body
        
                if (!name || !title || !location || !visibility || !category || !price){
                    return res.status(400).send('Missing params')
                }  

                const newEvent = new Event({
                    name: name,
                    title: title,
                    speaker: speaker,
                    description: description,
                    summary: summary,
                    location: location,
                    startTime: startTime,
                    endTime: endTime,
                    visibility: visibility,
                    category: category,
                    tags: tags,
                    price: price,
                })
                newEvent.save()
                return res.status(201).json(newEvent)

            } catch (err) {
        
            }
    }

}

const eventController = new EventController();
export default eventController.router;

