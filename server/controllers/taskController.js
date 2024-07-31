import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
  const { title, description, status, priority, deadline } = req.body;
  try {
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      deadline,
      userId: req.user.id,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error While Creating Task" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, deadline } = req.body;
  try {
    if (!title || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const task = await Task.findById(id);
    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.deadline = deadline;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error While Updating Task" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status);
  try {
    if (!status) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const task = await Task.findById(id);
    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error While Updating Task" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error While Deleting Task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    if (!tasks) {
      return res.status(404).json({ message: "No Tasks Found" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error While Fetching Tasks" });
  }
};
