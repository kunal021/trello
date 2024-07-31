"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { deleteTask, setTasks, updateTask } from "../store/taskSlice";
import { Task } from "../types";
import { AppDispatch, RootState } from "@/store/store";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";
import CreateButton from "./CreateButton";
import UpdateButton from "./UpdateButton";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const columns = ["To-Do", "In Progress", "Under Review", "Completed"];

const fetchTasks = async (dispatch: AppDispatch, token: string) => {
  try {
    const response = await axios.get(
      "https://trello-wzb3.onrender.com/api/task/get",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(setTasks(response.data));
  } catch (error) {
    console.error("Failed to fetch tasks", error);
  }
};

const TaskBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [isLoading, setIsLoading] = useState(true);

  const updateTaskStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const response = await axios.patch(
        `https://trello-wzb3.onrender.com/api/task/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      dispatch(updateTask(response.data));
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `https://trello-wzb3.onrender.com/api/task/delete/${id}`,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      if (response.status === 200) {
        dispatch(deleteTask(id));
        toast.success("Task Deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    fetchTasks(dispatch, JSON.parse(token)).finally(() => setIsLoading(false));
  }, [dispatch, token]);

  useEffect(() => {
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    const task = tasks.find((task: Task) => task._id === draggableId);
    const newStatus = columns[parseInt(destination.droppableId)];
    if (task && task.status !== newStatus) {
      updateTaskStatus(task._id, newStatus);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const isValidTask = (task: any): task is Task => {
    return (
      task && typeof task.status === "string" && typeof task._id === "string"
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-between p-5">
        {columns.map((column: string, index: number) => (
          <Droppable key={column} droppableId={index.toString()}>
            {(provided) => (
              <div
                className="min-w-60 m-2 h-fit"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="text-lg p-2 font-bold">{column}</h2>
                {tasks
                  .filter(isValidTask)
                  .filter((task: Task) => task.status === column)
                  .map((task: Task, taskIndex: number) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={taskIndex}
                    >
                      {(provided) => (
                        <div
                          className=" shadow-sm p-4 mb-2 bg-gray-100 rounded-lg"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex flex-col">
                            <p className="font-bold">{task.title}</p>
                            <p className="text-xs">{task.description}</p>
                            <p
                              className={`text-xs w-fit p-1 rounded-md ${
                                task.priority === "High" && "bg-red-500"
                              }  ${
                                task.priority === "Medium" && "bg-yellow-500"
                              } ${task.priority === "Low" && "bg-green-500"}`}
                            >
                              {task.priority}
                            </p>
                            <p className="text-xs">{task.deadline}</p>
                          </div>
                          <div className="flex justify-between mt-2">
                            <UpdateButton newData={task} />
                            <div
                              onClick={() => handleDeleteTask(task._id)}
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
                <CreateButton
                  title="Add new"
                  status={column}
                  classname="w-full mx-auto bg-gradient-to-t from-black to-gray-700 hover:bg-gradient-to-t hover:from-black hover:to-gray-700"
                />
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
