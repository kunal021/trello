"use client";

import { Button } from "./ui/button";
import { Pen, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { updateTask } from "@/store/taskSlice";
import { useDispatch } from "react-redux";
import { Task } from "@/types";

function UpdateButton({
  classname,
  newData,
}: {
  classname?: string;
  newData: Task;
}) {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const [data, setData] = useState<Task>({
    _id: newData._id,
    title: newData.title,
    description: newData.description,
    status: newData.status,
    priority: newData.priority,
    deadline: newData.deadline,
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateTask = async () => {
    if (!token) return;

    if (!data.title || !data.status) {
      toast.error("Title and Status are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `https://trello-wzb3.onrender.com/api/task/update/${newData._id}`,
        data,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );

      console.log(response);
      if (response.status === 200) {
        dispatch(updateTask(data));
        toast.success("Task Updates successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="w-full">
          <Pen className="h-5 w-5 text-blue-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Update task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={data.title}
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="Title "
            />
            <Textarea
              value={data.description}
              onChange={handleChange}
              name="description"
              placeholder="Description"
            />
            <div className="flex gap-4">
              <Select
                value={data.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To-Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={data.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input onChange={handleChange} name="deadline" type="date" />
            <p className="text-red-500 text-xs">
              Note: Title and Status are required.
            </p>
            <Button onClick={handleCreateTask} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdateButton;
