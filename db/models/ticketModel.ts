import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true, enum: ['purchased', 'redeemed'], default: 'purchased' },
    purchaseTime: {type: Date, required: true },
    redeemTime: {type: Date},
    hash: {type: String, required: true},
    addAppleWallet: {type: String},
    addAGoogleWallet: {type: String},
  })
  
  const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;