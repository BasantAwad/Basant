import React from 'react';
import { Navigation } from './Navigation';
import { BotanicalScene } from './BotanicalScene';
import { DustCanvas } from './DustCanvas';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { ProjectArchive } from './ProjectArchive';
import { NewsSection } from './NewsSection';
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
      {/* Botanical scene + dust — ABOVE sections so flowers are visible */}
      <BotanicalScene />
      <DustCanvas />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectArchive />
        <NewsSection />
        <CapabilityMap />
        <EducationSection />
        <GitHubLaboratory />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
