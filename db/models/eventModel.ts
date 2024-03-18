import mongoose from 'mongoose';
import { scheduler } from 'timers/promises';

const scheduleSchema = new mongoose.Schema({
    time: {type: Date, required: true},
    event: { type: String, required: true },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    speaker: { type: String},
    description: { type: String}, // markdown
    summary: { type: String}, // markdown
    location: { type: String, required: true},
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    schedule: [{type: scheduleSchema}],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    visibility: { type: String, required: true, enum: ['public', 'private', 'invite'], default: 'public'},
    category: {type: String, required: true },
    tags: { type: [String], required: true },
    price: { type: Number, required: true },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
});

const Event = mongoose.model('Event', eventSchema);


export default Event;