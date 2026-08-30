import React, { useRef } from 'react';
import { experience } from '../data/experience';
import { BotanicalScene } from './BotanicalScene';
import './Experience.css';

function formatDate(d: string | null) {
  return d ?? 'Circa 2024–2026';
}

function EntryCard({ entry }: { entry: (typeof experience)[0] }) {
  const typeLabel = {
    experience: 'Experience',
    teaching: 'Teaching',
    leadership: 'Leadership and community',
  }[entry.type] as string;

  return (
    <article className={`timeline-entry timeline-entry--${entry.type}`}>
      <div className="timeline-entry__marker" aria-hidden="true">
        <span className="specimen-number">{entry.specimen}</span>
      </div>

      <div className="timeline-entry__body">
        <div className="timeline-entry__meta">
          <span className="timeline-entry__type">{typeLabel}</span>
          {entry.species && (
            <span className="timeline-entry__species">
              <span className="specimen-label">Associate species</span>
              <span style={{ margin: '0 0.35em' }}>{entry.species}</span>
            </span>
          )}
        </div>

        <h3 className="timeline-entry__role">{entry.role}</h3>
        <p className="timeline-entry__org">{entry.organization}</p>
        <p className="timeline-entry__location">{entry.location}</p>
        {entry.dates && (
          <p className="timeline-entry__dates">{formatDate(entry.dates)}</p>
        )}

        <ul className="timeline-entry__milestones">
          {entry.milestones.map((m, i) => (
            <li key={i} className="milestone">
              {m.challenge && (
                <p className="milestone__challenge">
                  <span className="specimen-label">Challenge</span>
                  <span className="milestone__text">{m.challenge}</span>
                </p>
              )}
              {m.solution && (
                <p className="milestone__solution">
                  <span className="specimen-label">Approach</span>
                  <span className="milestone__text">{m.solution}</span>
                </p>
              )}
              {m.outcome && (
                <p className="milestone__outcome">
                  <span className="specimen-label">Outcome</span>
                  <span className="milestone__text">{m.outcome}</span>
                </p>
              )}
              {!m.challenge && !m.solution && !m.outcome && (
                <p className="milestone__text">{m.solution}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export const ExperienceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="experience" className="experience">
      {/* Decorative botanical layer */}
      <div className="experience__botany" aria-hidden="true">
        <BotanicalScene />
      </div>

      <div className="experience__header container--narrow">
        <span className="specimen-label">Field annotation · Section III</span>
        <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
          Stem · professional growth
        </span>

        <h2 className="experience__heading">Experience</h2>
        <p className="experience__intro">
          A brief timeline of work, teaching, and community contributions.
          Each entry is marked with a specimen number and an associate botanical species
          used only as a metaphorical accent — not a literal description of the work.
        </p>
      </div>

      <div className="timeline container--narrow" ref={containerRef}>
        {experience.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      <div className="experience__footer">
        <span className="specimen-label">Document reference · BA-EXP-2026</span>
        <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
          Verified against CV and public GitHub profile
        </span>
      </div>
    </section>
  );
};
