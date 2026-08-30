import React from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { ProjectArchive } from './ProjectArchive';
import { CapabilityMap } from './CapabilityMap';
import { EducationSection } from './EducationSection';
import { GitHubLaboratory } from './GitHubLaboratory';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import './AppShell.css';

export const AppShell: React.FC = () => {
  return (
    <div className="app-shell">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectArchive />
        <CapabilityMap />
        <EducationSection />
        <GitHubLaboratory />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
