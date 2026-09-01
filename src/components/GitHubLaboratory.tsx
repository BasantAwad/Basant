import { useRef } from 'react';
import { githubRepos, githubLaboratory } from '../data/github';
import './GitHubLaboratory.css';

function RepoRow({ repo, idx }: { repo: (typeof githubRepos)[0]; idx: number }) {
  const isHighlighted =
    ['NovaCare', 'File-Storage-platform', 'aiops-lab', 'microservices', 'v0-flora-care-web-platform'].includes(
      repo.name
    );

  return (
    <div
      className={`repo-row${isHighlighted ? ' repo-row--highlight' : ''}`}
      style={{ '--repo-idx': idx } as React.CSSProperties}
    >
      <a href={repo.url} className="repo-row__link" target="_blank" rel="noopener noreferrer">
        <span className="repo-row__name">{repo.name}</span>
        {repo.language && (
          <span className="repo-row__lang">{repo.language}</span>
        )}
        {repo.note && (
          <span className="repo-row__note">{repo.note}</span>
        )}
      </a>
      {isHighlighted && (
        <span className="repo-row__accent" aria-hidden="true">
          Featured
        </span>
      )}
    </div>
  );
}

export const GitHubLaboratory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const featured = githubRepos.filter((repo) =>
    ['NovaCare', 'File-Storage-platform', 'aiops-lab', 'microservices', 'v0-flora-care-web-platform'].includes(repo.name)
  );

  return (
    <section id="github" className="github-lab">
      <div className="github-lab__header container--narrow">
        <h2 className="github-lab__heading">GitHub laboratory</h2>
        <p className="github-lab__intro">
          {githubLaboratory.intro}
        </p>
        <div className="github-lab__stats">
          <span className="github-lab__total">
            {githubRepos.length} public repositories
          </span>
        </div>
      </div>

      <div className="github-lab__content container--narrow" ref={containerRef}>
        {/* Featured projects */}
        <div className="github-lab__group">
          <span className="github-lab__group-label">
            Featured projects
          </span>
          <div className="github-lab__rows">
            {featured.map((repo, idx) => (
              <RepoRow key={repo.name} repo={repo} idx={idx} />
            ))}
          </div>
        </div>

        {/* Full index */}
        <div className="github-lab__group">
          <span className="github-lab__group-label">
            Complete index ({githubRepos.length} repositories)
          </span>
          <div className="github-lab__rows">
            {githubRepos.map((repo, idx) => (
              <RepoRow key={repo.name} repo={repo} idx={idx} />
            ))}
          </div>

          {/* Additional note for Glow */}
          <p className="github-lab__note">
            {'Glow'} is included as an additional GitHub project; its description is pending confirmation.
          </p>
        </div>
      </div>

      <div className="github-lab__footer">
        <a
          href="https://github.com/BasantAwad"
          className="github-lab__view-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all on GitHub
        </a>
      </div>
    </section>
  );
};
