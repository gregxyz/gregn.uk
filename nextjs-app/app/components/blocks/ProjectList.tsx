import type { Project as ProjectProps } from "@/sanity.types";
import ProjectCard from "../common/ProjectCard";

interface Props {
  block: {
    projects: ProjectProps[];
  };
}

function ProjectList({ block }: Props) {
  return (
    <section className="mt-20 pb-20 md:px-10">
      <div className="space-y-5">
        {block.projects?.map((project) => (
          <div
            key={project._id}
            className="not-last:mb-20 border-b border-b-black/10 pb-5 md:border-black/10 md:border-t md:border-b-0 md:pt-5 md:pb-0"
          >
            <ProjectCard card={project} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectList;
