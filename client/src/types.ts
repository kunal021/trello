export interface Task {
  _id: string;
  userId?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  deadline?: string;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface UpdateTaskStatusPayload {
  id: string;
  status: string;
}
