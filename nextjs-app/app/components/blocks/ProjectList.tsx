import type { Project as ProjectProps } from "@/sanity.types";
import ProjectCard from "../common/ProjectCard";

interface Props {
  block: {
    projects: ProjectProps[];
  };
}

function ProjectList({ block }: Props) {
  return (
    <section className="pt-15 pb-20 md:pt-20">
      <div className="grid grid-cols-6 gap-12 sm:px-10">
        {block.projects?.map((project, index) => (
          <div
            key={project._id}
            className="col-span-6 md:col-span-3 xl:col-span-2"
          >
            <ProjectCard card={project} animationDelay={index * 0.3} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectList;
