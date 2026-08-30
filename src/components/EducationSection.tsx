import React from 'react';
import { education, certifications } from '../data/education';
import { BotanicalScene } from './BotanicalScene';
import './Education.css';

function CertCard({ cert }: { cert: (typeof certifications)[0] }) {
  return (
    <div className="cert-card">
      <div className="cert-card__header">
        <span className="specimen-number">{cert.specimen}</span>
        <span className="cert-card__species">{cert.species}</span>
      </div>
      <h4 className="cert-card__name">{cert.name}</h4>
      <p className="cert-card__issuer">{cert.issuer}</p>
      <p className="cert-card__date">{cert.date}</p>
    </div>
  );
}

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="education">
      {/* Cultivation-stage botanical layer */}
      <div className="education__botany" aria-hidden="true">
        <BotanicalScene />
      </div>

      <div className="education__header container--narrow">
        <span className="specimen-label">Field annotation · Section VI</span>
        <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
          Cultivation stage · education, teaching, and certifications
        </span>

        <h2 className="education__heading">Education & teaching</h2>

        <p className="education__intro">
          Basant is completing a Bachelor of Science in Computer Science with a specialization
          in Software Engineering, and has taken on teaching roles across university laboratories
          and secondary-school programs.
        </p>
      </div>

      <div className="education__grid container--narrow">
        {/* Degree */}
        <div className="edu-block">
          <div className="edu-block__header">
            <span className="specimen-label">Field record · ED-001</span>
            <span className="edu-block__species">Soil & cultivation</span>
          </div>
          <h3 className="edu-block__degree">{education.degree.title}</h3>
          <p className="edu-block__specialization">{education.degree.specialization}</p>
          <p className="edu-block__institution">{education.degree.institution}</p>
          <p className="edu-block__dates">{education.degree.dates}</p>
        </div>

        {/* Coursework */}
        <div className="edu-block">
          <div className="edu-block__header">
            <span className="specimen-label">Field record · ED-002</span>
            <span className="edu-block__species">Coursework roots</span>
          </div>
          <h4 className="edu-block__label">Relevant coursework</h4>
          <ul className="edu-block__list">
            {education.coursework.map((item) => (
              <li key={item} className="edu-block__item">
                <span className="edu-block__item-mark" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Teaching */}
        <div className="edu-block edu-block--wide">
          <div className="edu-block__header">
            <span className="specimen-label">Field record · ED-003</span>
            <span className="edu-block__species">Teaching & cultivation</span>
          </div>
          <h4 className="edu-block__label">Teaching experience</h4>
          <p className="edu-block__teaching-summary">
            Basant has supported instruction as a Student Teaching Assistant at Al Alamein
            International University, leading laboratory sessions on SOLID principles, design
            patterns, clean architecture, and backend engineering, and as a Technical Course
            Instructor at Bianki Modern School teaching hardware-software interfacing for IoT.
          </p>
        </div>

        {/* Certifications */}
        <div className="edu-block">
          <div className="edu-block__header">
            <span className="specimen-label">Field record · ED-004</span>
            <span className="edu-block__species">Certifications · buds</span>
          </div>
          <h4 className="edu-block__label">Certifications</h4>
          <div className="edu-block__certs">
            {certifications.map((cert) => (
              <CertCard key={cert.name} cert={cert} />
            ))}
          </div>
        </div>
      </div>

      <div className="education__footer">
        <span className="specimen-label">Education record · BA-EDU-2026</span>
        <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
          Verified against CV source of truth
        </span>
      </div>
    </section>
  );
};
