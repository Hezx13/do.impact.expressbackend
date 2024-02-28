import mongoose from 'mongoose'
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    socials: {
        type: [String],
        validate: [socialsLimit, '{PATH} exceeds the limit of 5'],
    }, 
    attendedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

function socialsLimit(val: Array<string>) {
    return val.length <= 5;
  }

const User = mongoose.model('User', userSchema);

export default User;