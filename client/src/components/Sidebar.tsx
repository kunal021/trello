"use client";

import { useAuth } from "../context/AuthContext";
import CreateButton from "./CreateButton";

function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="shadow-md w-56 flex flex-col gap-6 min-h-screen">
      <div className="text-center text-lg font-medium p-5">{user?.name}</div>
      <CreateButton
        title="Create new task"
        classname="w-[80%] mx-auto bg-gradient-to-t from-indigo-900 to-indigo-700 hover:bg-gradient-to-t hover:from-indigo-900 hover:to-indigo-700"
      />
    </div>
  );
}

export default Sidebar;
