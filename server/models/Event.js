import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  name: { 
    type: String, 
    required: [true, "Please add an event name"] 
  },
  type: { 
    type: String, 
    required: [true, "Please add event type"],
    enum: ['wedding', 'birthday', 'corporate', 'conference', 'party', 'other']
  },
  date: { 
    type: Date, 
    required: [true, "Please add event date"] 
  },
  guests: { 
    type: Number, 
    required: [true, "Please add number of guests"],
    min: 1
  },
  budget: { 
    type: Number, 
    required: [true, "Please add budget"],
    min: 0
  },
  location: { 
    type: String, 
    required: [true, "Please add location"] 
  },
  tasks: [taskSchema]
}, {
  timestamps: true
});

// Add index for better query performance
eventSchema.index({ userId: 1, date: 1 });

export default mongoose.model("Event", eventSchema);