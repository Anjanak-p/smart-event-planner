import Event from "../models/Event.js";

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { name, type, date, guests, budget, location, tasks } = req.body;

    // Validation
    if (!name || !type || !date || !guests || !budget || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields"
      });
    }

    // Create event
    const event = await Event.create({
      userId: req.user.id,
      name,
      type,
      date,
      guests,
      budget,
      location,
      tasks: tasks || []
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating event",
      error: error.message
    });
  }
};

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ date: 1 });
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching events",
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating event",
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted successfully",
      data: {}
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting event",
      error: error.message
    });
  }
};