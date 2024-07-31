import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
    </div>
  );
}

export default Loader;
