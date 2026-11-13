import React from "react";
import { Loader2 } from "lucide-react";

export const Loader = ({ message = "Loading...", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-3 text-sm font-semibold text-slate-600 tracking-wide">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="mt-2 text-xs font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default Loader;

