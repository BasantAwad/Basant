import React from 'react';
import { capabilitySections, capabilities, capabilityAnchor } from '../data/capabilities';
import { useScrollProgress, localProgress } from '../hooks/useScrollProgress';
import './Capabilities.css';

/**
 * CapabilityMap — groups technologies as botanical clusters.
 * Each cluster is a leaf/branch/bud/token marker; no proficiency ratings.
 */

function Cluster({
  section,
  items,
  progress,
  anchor,
}: {
  section: (typeof capabilitySections)[0];
  items: string[];
  progress: number;
  anchor: number;
}) {
  const local = localProgress(progress, anchor, anchor + 0.035);
  const opacity = Math.min(1, Math.max(0, (local - 0.2) / 0.6));
  const translateX = (1 - local) * 20;

  return (
    <div
      className="cap-cluster"
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        transition: 'none',
      }}
    >
      <div className="cap-cluster__header">
        <span className="specimen-label">{section.label}</span>
        <span className="cap-cluster__icon" aria-hidden="true">
          {section.icon === 'leaf' && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4 12 C8 8, 14 6, 20 8 C18 10, 12 12, 4 12 Z" opacity="0.8" />
            </svg>
          )}
          {section.icon === 'stem' && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 4 C12 8, 8 12, 8 16 C8 20, 12 22, 12 22" />
            </svg>
          )}
          {section.icon === 'tendril' && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M4 12 C8 8, 12 14, 16 10 C20 6, 22 10, 22 10" />
            </svg>
          )}
          {section.icon === 'branch' && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 6 C12 10, 6 12, 4 16 M12 6 C12 10, 18 12, 20 16" />
            </svg>
          )}
          {section.icon === 'bud' && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <ellipse cx="12" cy="14" rx="3" ry="5" />
              <path d="M12 9 C9 7, 7 5, 6 3" />
            </svg>
          )}
          {section.icon === 'root' && (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 20 C8 16, 4 12, 2 8 M12 20 C16 16, 20 12, 22 8 M12 20 C10 18, 9 15, 9 13" />
            </svg>
          )}
        </span>
      </div>

      <div className="cap-cluster__items">
        {items.map((item) => (
          <span key={item} className="cap-chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export const CapabilityMap: React.FC = () => {
  const { progress } = useScrollProgress();
  return (
    <section id="capabilities" className="capabilities">
      <div className="capabilities__header container--narrow">

        <h2 className="capabilities__heading">Technical capabilities</h2>
        <p className="capabilities__intro">
          A capability map of technical skills — languages, backend, databases,
          messaging, cloud infrastructure, AI, and methodologies.
        </p>
      </div>

      <div className="capabilities__grid container--narrow">
        {capabilitySections.map((section) => {
          const items = capabilities[section.id as keyof typeof capabilities];
          if (!items) return null;
          return (
            <Cluster
              key={section.id}
              section={section}
              items={items}
              progress={progress}
              anchor={capabilityAnchor[section.id as keyof typeof capabilityAnchor] ?? 0.7}
            />
          );
        })}
      </div>


    </section>
  );
};
