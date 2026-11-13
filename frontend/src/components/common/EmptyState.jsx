import React from "react";
import { PackageOpen } from "lucide-react";
import Button from "./Button";

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "No records found",
  description = "Get started by creating your first entry.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 my-4">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

