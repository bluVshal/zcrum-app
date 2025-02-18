"use client";

import React, { useEffect, useState } from "react";
import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/app/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { createProject } from "@/app/actions/projects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    data: project,
    loading,
    error,
    fn: createProjectFn,
  } = useFetch(createProject);
  
  useEffect(() => {
    if (project) {
      toast.success("Project created successfully");
      router.push(`/project/${project.id}`);
    }
    return () => {};
  }, [loading]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  const onSubmit = async (data) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn(data);
  };

  if (!isAdmin) {
    return (
      <div className="flex felx-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          {" "}
          Oops! Only Admins can create projects.{" "}
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            id="proj-name"
            className="bg-slate-950"
            placeholder="Project Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            id="proj-key"
            className="bg-slate-950"
            placeholder="Project Key (Ex: ZCR)"
            {...register("key")}
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
          )}
        </div>
        <div>
          <Textarea
            id="proj-description"
            className="bg-slate-950 h-28"
            placeholder="Project Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <Button
          disabled={loading}
          type="submit"
          size="lg"
          className="bg-blue-500 text-white"
        >
          {loading ? "Creating Project..." : "Create Project"}
        </Button>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateProjectPage;
