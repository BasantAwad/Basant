import React from 'react';
import { education, certifications } from '../data/education';
import './Education.css';

function CertCard({ cert }: { cert: (typeof certifications)[0] }) {
  return (
    <div className="cert-card">

      <h4 className="cert-card__name">{cert.name}</h4>
      <p className="cert-card__issuer">{cert.issuer}</p>
      <p className="cert-card__date">{cert.date}</p>
    </div>
  );
}

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="education">
      <div className="education__header container--narrow">

        <h2 className="education__heading">Education & teaching</h2>

        <p className="education__intro">
          I am completing a Bachelor of Science in Computer Science with a specialization
          in Software Engineering, and have taken on teaching roles across university laboratories
          and secondary-school programs.
        </p>
      </div>

      <div className="education__grid container--narrow">
        {/* Degree */}
        <div className="edu-block">

          <h3 className="edu-block__degree">{education.degree.title}</h3>
          <p className="edu-block__specialization">{education.degree.specialization}</p>
          <p className="edu-block__institution">{education.degree.institution}</p>
          <p className="edu-block__dates">{education.degree.dates}</p>
        </div>

        {/* Coursework */}
        <div className="edu-block">

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

          <h4 className="edu-block__label">Teaching experience</h4>
          <p className="edu-block__teaching-summary">
            I have supported instruction as a Student Teaching Assistant at Al Alamein
            International University, leading laboratory sessions on SOLID principles, design
            patterns, clean architecture, and backend engineering, and as a Technical Course
            Instructor at Bianki Modern School teaching hardware-software interfacing for IoT.
          </p>
        </div>

        {/* Certifications */}
        <div className="edu-block">

          <h4 className="edu-block__label">Certifications</h4>
          <div className="edu-block__certs">
            {certifications.map((cert) => (
              <CertCard key={cert.name} cert={cert} />
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};
