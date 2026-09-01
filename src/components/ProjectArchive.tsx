import { projects } from '../data/projects';
import './Projects.css';

type ProjectCardProps = {
  project: (typeof projects)[0];
  index: number;
};

function ProjectCard({ project, index }: ProjectCardProps) {
  const githubLabel = project.github ? (
    <a href={project.github} className="project-card__github" target="_blank" rel="noopener noreferrer">
      View on GitHub
      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.975 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.36.81 1.095.81 2.235 0 1.635-.015 2.88-.015 3.3 0 .315.225.682.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor" />
      </svg>
    </a>
  ) : (
    <span className="project-card__github project-card__github--placeholder">
      GitHub link pending
    </span>
  );

  return (
    <article className="project-card" style={{ '--project-index': index } as React.CSSProperties}>
      {/* Card Header */}
      <div className="project-card__header">
        <span className="project-card__category">{project.category}</span>
      </div>

      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__tagline">{project.tagline}</p>


      {/* Technologies */}
      <div className="project-card__tech">
        <span className="specimen-label">Technologies</span>
        <div className="project-card__tech-list">
          {project.technologies.map((t) => (
            <span key={t} className="project-card__tech-tag">{t}</span>
          ))}
        </div>
      </div>


      {/* Narrative */}
      <div className="project-card__narrative">
        <p className="project-card__challenge">
          <span className="specimen-label">Challenge</span>
          {project.challenge}
        </p>
        <p className="project-card__solution">
          <span className="specimen-label">Solution</span>
          {project.solution}
        </p>
        {project.outcome && (
          <p className="project-card__outcome">
            <span className="specimen-label">Measured outcome</span>
            {project.outcome}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="project-card__footer">
        {githubLabel}
      </div>
    </article>
  );
}

export const ProjectArchive: React.FC = () => {
  return (
    <section id="projects" className="projects">
      <div className="projects__header container--narrow">
        <h2 className="projects__heading">Selected projects</h2>
        <p className="projects__intro">
          Five projects presented as a modern portfolio archive.
          Each card records the project name, category, technologies, challenge,
          solution, and outcome where available.
        </p>
      </div>

      <div className="projects__grid container--narrow">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
