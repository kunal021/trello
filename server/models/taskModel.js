import mongoose from "mongoose";

const validStatuses = ["To-Do", "In Progress", "Under Review", "Completed"];

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, enum: validStatuses },
  priority: { type: String },
  deadline: { type: String },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
