import { chromium } from 'playwright';

const BASE = 'http://localhost:4173/';

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const issues = [];
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // 1. Load the page
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const title = await page.title();
  if (!title.includes('Basant')) issues.push('Title missing Basant');

  // 2. Verify hero content
  const heroName = await page.locator('section#home h1').first().textContent();
  if (!heroName?.includes('Basant Awad Mohamed')) issues.push('Hero name missing');

  const heroTitle = await page.locator('.hero__title-lead').first().textContent();
  if (!heroTitle?.includes('Backend Software Engineer')) issues.push('Hero title missing');

  const heroTagline = await page.locator('.hero__tagline').first().textContent();
  if (!heroTagline?.includes('reliable systems')) issues.push('Hero tagline missing');

  // 3. Verify availability + location
  const avail = await page.locator('.hero__meta-item--available').first().textContent();
  if (!avail?.includes('relocation')) issues.push('Availability label missing');

  const loc = await page.locator('.hero__meta-item').first().textContent();
  if (!loc?.includes('Alexandria')) issues.push('Location missing');

  // 4. Verify CTAs
  const viewWorkBtn = await page.locator('.btn--primary').first().textContent();
  if (!viewWorkBtn?.includes('selected work')) issues.push('Primary CTA missing');

  const connectBtn = await page.locator('.btn--ghost').first().textContent();
  if (!connectBtn?.includes('Connect')) issues.push('Ghost CTA missing');

  // 5. Verify navigation
  const navLinks = await page.locator('.navigation__link').allTextContents();
  const navTexts = navLinks.map(t => t.trim());
  const requiredNav = ['About', 'Experience', 'Projects', 'Capabilities', 'Education', 'Contact'];
  for (const r of requiredNav) {
    if (!navTexts.some(t => t === r)) issues.push(`Nav link missing: ${r}`);
  }

  // 6. Scroll to sections and verify content
  const sections = [
    { id: 'about', checks: [
      el => el.textContent().includes('Backend Software Engineer'),
      el => el.textContent().includes('Software Engineering'),
    ]},
    { id: 'experience', checks: [
      el => el.textContent().includes('Bibliotheca Alexandrina'),
      el => el.textContent().includes('ITI'),
      el => el.textContent().includes('Al Alamein International University'),
      el => el.textContent().includes('Bianki Modern School'),
      el => el.textContent().includes('AIU ICPC'),
    ]},
    { id: 'projects', checks: [
      el => el.textContent().includes('ColdBridge'),
      el => el.textContent().includes('Nexus FS'),
      el => el.textContent().includes('AIOps'),
      el => el.textContent().includes('NovaCare'),
      el => el.textContent().includes('FitCoach Pro'),
    ]},
    { id: 'capabilities', checks: [
      el => el.textContent().includes('Python'),
      el => el.textContent().includes('Java'),
      el => el.textContent().includes('PostgreSQL'),
      el => el.textContent().includes('Kafka'),
      el => el.textContent().includes('React'),
      el => el.textContent().includes('Machine Learning'),
    ]},
    { id: 'education', checks: [
      el => el.textContent().includes('Al Alamein International University'),
      el => el.textContent().includes('Software Engineering'),
      el => el.textContent().includes('Vanderbilt'),
      el => el.textContent().includes('IBM'),
      el => el.textContent().includes('AWS'),
      el => el.textContent().includes('4TU'),
      el => el.textContent().includes('Algorithmic Toolbox'),
    ]},
    { id: 'github', checks: [
      el => el.textContent().includes('GitHub laboratory'),
      el => el.textContent().includes('NovaCare'),
      el => el.textContent().includes('File-Storage-platform'),
      el => el.textContent().includes('aiops-lab'),
    ]},
    { id: 'contact', checks: [
      el => el.textContent().includes('basantawad014@gmail.com'),
      el => el.textContent().includes('basantabdalla'),
      el => el.textContent().includes('BasantAwad'),
      el => el.textContent().includes('Open to relocation'),
      el => el.textContent().includes('Alexandria'),
    ]},
  ];

  for (const section of sections) {
    await page.evaluate((id) => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }, section.id);
    await page.waitForTimeout(300);
    const content = await page.locator(`#${section.id}`).textContent();
    for (const check of section.checks) {
      try {
        if (!check({ textContent: () => content })) {
          issues.push(`Section ${section.id} missing: ${check.toString().slice(0, 80)}`);
        }
      } catch (e) {
        issues.push(`Section ${section.id} check error: ${e.message}`);
      }
    }
  }

  // 7. Verify contact links (href attributes)
  const emailHref = await page.locator('.contact__link--email').getAttribute('href');
  if (!emailHref?.includes('basantawad014@gmail.com')) issues.push('Email href wrong');

  const linkedinHref = await page.locator('.contact__link--linkedin').getAttribute('href');
  if (!linkedinHref?.includes('linkedin.com/in/basantabdalla')) issues.push('LinkedIn href wrong');

  const githubHref = await page.locator('.contact__link--github').getAttribute('href');
  if (!githubHref?.includes('github.com/BasantAwad')) issues.push('GitHub href wrong');

  // 8. Check no console errors (ignore favicon 404s)
  const realErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('404'));
  if (realErrors.length > 0) {
    issues.push(`Console errors (${realErrors.length}): ${realErrors.slice(0, 3).join('; ')}`);
  }

  // 9. Mobile responsive - set viewport
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto(BASE, { waitUntil: 'networkidle' });

  const menuBtn = await mobilePage.locator('.navigation__menu-btn').isVisible();
  if (!menuBtn) issues.push('Mobile menu button not visible');

  const mobileOverflow = await mobilePage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });
  if (mobileOverflow) issues.push('Mobile horizontal overflow');

  await mobilePage.close();

  // 10. Reduced motion - check it doesn't break layout
  const reducedPage = await browser.newPage({
    viewport: { width: 1400, height: 900 },
    colorScheme: 'dark'
  });
  await reducedPage.addStyleTag({ content: '@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }' });
  await reducedPage.goto(BASE, { waitUntil: 'networkidle' });
  const reducedContent = await reducedPage.locator('body').textContent();
  if (!reducedContent?.includes('Basant Awad Mohamed')) issues.push('Reduced motion mode broken');
  await reducedPage.close();

  await browser.close();

  if (issues.length === 0) {
    console.log('✅ ALL QA CHECKS PASSED');
  } else {
    console.log('❌ ISSUES FOUND:');
    issues.forEach(i => console.log('  -', i));
  }

  return issues;
}

runTests().then(issues => {
  process.exit(issues.length > 0 ? 1 : 0);
}).catch(err => {
  console.error('TEST ERROR:', err);
  process.exit(1);
});
