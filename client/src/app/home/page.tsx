import Home from "@/components/Home";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

function page() {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <Home />
      </div>
    </ProtectedRoute>
  );
}

export default page;
