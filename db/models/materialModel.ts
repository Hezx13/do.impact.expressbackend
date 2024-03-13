import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    name: {type: String, required: true},
    link: {type: String, required: true},
  })
  
  const Material = mongoose.model('Material', materialSchema);
  
export default Material;