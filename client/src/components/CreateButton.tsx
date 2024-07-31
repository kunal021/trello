"use client";

import { Button } from "./ui/button";
import { Plus } from "lucide-react";
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
import { addTask } from "@/store/taskSlice";
import { useDispatch } from "react-redux";

interface Task {
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
}

function CreateButton({
  title,
  classname,
  status,
}: {
  title: string;
  classname?: string;
  status?: string;
}) {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const [data, setData] = useState<Task>({
    title: "",
    description: "",
    status: status || "To-Do", // Set a default status
    priority: "",
    deadline: "",
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
      const response = await axios.post(
        "https://trello-wzb3.onrender.com/api/task/create",
        data,
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );

      console.log(response.data);
      if (response.status === 201) {
        dispatch(addTask(response.data));
        toast.success("Task created successfully");
        setData({
          title: "",
          description: "",
          status: "To-Do",
          priority: "",
          deadline: "",
        });
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
          <Button className={`${classname} flex justify-between items-center`}>
            {title}{" "}
            <div className="rounded-full">
              <Plus fill="#000000" />
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Create a new task</DialogTitle>
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateButton;
