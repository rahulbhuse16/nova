"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface TaskActionBarProps {
  onCreateTask: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isCreating?: boolean;
  isSaving?: boolean;
}

export function TaskActionBar({
  onCreateTask,
  onSaveDraft,
  onCancel,
  isCreating = false,
  isSaving = false,
}: TaskActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-end gap-3 pt-6 border-t border-slate-700/50"
    >
      <SecondaryButton onClick={onCancel} disabled={isCreating || isSaving}>
        Cancel
      </SecondaryButton>
      <SecondaryButton
        onClick={onSaveDraft}
        disabled={isCreating || isSaving}
      >
        Save Draft
      </SecondaryButton>
      <PrimaryButton
        onClick={onCreateTask}
        disabled={isCreating || isSaving}
        loading={isCreating}
      >
        Create Task
      </PrimaryButton>
    </motion.div>
  );
}
