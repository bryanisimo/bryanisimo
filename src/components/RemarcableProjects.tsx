import { Link } from "react-router-dom";
import { Project, projects } from "../data/projects";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

const RemarcableProjectCard = ({ project }: { project: Project }) => {
  const [roundedCorners, setRoundedCorners] = useState<string>(
    "rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-3xl",
  );

  useEffect(() => {
    const updateRoundedCorners = () => {};

    updateRoundedCorners();

    const randomCorners = setInterval(() => {
      const randomValues = Array(4)
        .fill(0)
        .map(() => Math.random() < 0.5);
      setRoundedCorners(`
        rounded-tl-${randomValues[0] ? "none" : "none"}
        rounded-tr-${randomValues[1] ? "none" : "none"}
        rounded-bl-${randomValues[2] ? "none" : "none"}
        rounded-br-${randomValues[3] ? "none" : "none"}`);
    }, 2000);
    return () => clearInterval(randomCorners);
  }, []);
  return (
    <>
      <Link
        to={`/project/${project.id}`}
        key={project.id}
        className={twMerge(
          "flex flex-col gap-4 h-40 p-8 group",
          "bg-[#BAE0F0]/40 border border-[#BAE0F0]/10 cursor-pointer",
          "hover:bg-[#BAE0F0] hover:border-[#BAE0F0]",
          "transition-colors duration-300 ease-in-out",
          roundedCorners,
        )}
      >
        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
        <p className="text-sm leading-relaxed text-white">
          {project.summary ? project.summary.slice(0, 120) + "..." : ""}
        </p>
      </Link>
    </>
  );
};
const RemarcableProjects = ({ className }: { className?: string }) => {
  return (
    <section
      className={twMerge(
        `flex flex-col text-white bg-[#8CBBCE] p-8`,
        className,
      )}
      id="projects"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-bold">Remarkable Projects</h2>
      </div>
      <div className="flex flex-col gap-6">
        {projects.map((project, index) => (
          <RemarcableProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};
/*

  --color-sky-aqua: #4fc6e3;
  --color-bondi-blue: #1985a1;
  --color-strawberry-red: #e71d36;
  --color-tomato: #fe4a49;
  --color-orange: #ffae03;
  --color-amber-flame: #ffbe33;
  --color-medium-jungle: #4da852;
  --color-yellow-green: #9bc53d;
  --color-ink-black: #001021;
*/

export default RemarcableProjects;
