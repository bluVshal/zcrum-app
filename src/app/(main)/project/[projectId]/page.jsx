import { getProject } from "@/app/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from '../_components/create-sprint';
import SprintBoard from "../_components/sprint-board";

const ProjectPage = async ({ params }) => {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={project.id}
        projectKey={project.key}
        sprintKey={project.sprints?.length+1}
      />
      {project.sprints.length > 0 ? (
        <SprintBoard 
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div> Create a Sprint from the button above</div>
      )}
    </div>
  );
};

export default ProjectPage;
