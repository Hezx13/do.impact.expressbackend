import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    speaker: { type: String},
    description: { type: String}, // markdown
    summary: { type: String}, // markdown
    location: { type: String, required: true},
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    visibility: { type: String, required: true, enum: ['public', 'private', 'invite'], default: 'public'},
    category: {type: String, required: true },
    tags: { type: [String], required: true },
    price: { type: Number, required: true },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
});

const Event = mongoose.model('Event', eventSchema);

export default Event;