import React from 'react';
import { Navigation } from './Navigation';
import { BotanicalScene } from './BotanicalScene';
import { DustCanvas } from './DustCanvas';
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
      <main className="app-shell__main">
        {/* Full-page botanical overlay — one scene driven by document scroll */}
        <div className="app-shell__botany" aria-hidden="true">
          <BotanicalScene />
          <DustCanvas />
        </div>
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
