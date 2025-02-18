"use client";

import React, { useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/projects";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteProject = ({ projectId }) => {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const {
    data: deleted,
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
  } = useFetch(deleteProject);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn(projectId);
    }
  };
  const router = useRouter();

  useEffect(() => {
    if (deleted?.success) {
        toast.success("Project Deleted");
        router.refresh();
    }
  }, [deleted]);

  if (!isAdmin) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
