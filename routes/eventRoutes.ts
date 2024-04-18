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

        //PUBLIC ROUTES
        this.router.get('/', this.getEventList.bind(this));
        this.router.get('/short', this.getEventsShortList.bind(this));
        this.router.get('/upcoming', this.getUpcomingEvent.bind(this));

        //PROTECTED ROUTES
        this.router.post('/',authMiddleware, this.addEvent.bind(this));
        this.router.get('/:eventId', authMiddleware, this.getEvent.bind(this));
        this.router.patch('/:eventId', authMiddleware, this.updateEvent.bind(this));
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

    @LogRoute("HTTP Request event")
    async getUpcomingEvent(req: Request, res: Response) {
        try {
            const now = new Date();
            console.log(now);
            const nearestEvent = await Event.findOne({ startTime: { $gte: now } })
                                            .sort({ startTime: 1 })
                                            .lean();
            if (!nearestEvent) {
                return res.status(404).send('No upcoming events found.');
            }
            return res.status(200).json(nearestEvent);
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

    @LogRoute("HTPP Request event")
    async updateEvent(req: Request,res: Response){
        const {eventId} = req.params;
        const {updates} = req.body;
        try {
            const updatedResource = await Event.findByIdAndUpdate(eventId, updates, { new: true });
            if (!updatedResource) {
              return res.status(404).send();
            }
            return res.status(200).json(updatedResource);
          } catch (error) {
            res.status(500).send("Internal server error");
          }
    }

}

const eventController = new EventController();
export default eventController.router;

