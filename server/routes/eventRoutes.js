import express from "express";
import { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent 
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Protect all event routes

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;