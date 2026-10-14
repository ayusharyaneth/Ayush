import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './Icons';
import { sound } from '../utils/soundEffects';
import { smoothScrollTo } from '../utils/smoothScroll';
import { ScrollReveal } from './ScrollReveal';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ personal = {}, socials = [] }) {
  const scrollToTop = () => {
    sound.playClick();
    smoothScrollTo('top');
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Resolve social URLs
  const githubLink = socials.find((s) => s.name?.toLowerCase().includes('github'))?.url || 'https://github.com/ayusharyaneth/';
  const twitterLink = socials.find((s) => s.name?.toLowerCase().includes('twitter') || s.name?.toLowerCase().includes('x'))?.url || 'https://x.com/ayusharyaneth';
  const linkedinLink = socials.find((s) => s.name?.toLowerCase().includes('linkedin'))?.url || 'https://www.linkedin.com/in/theayusharyan';

  return (
    <footer className="footer-section">
      <div className="container">
        <ScrollReveal variant="fade-up" distance={16} duration={0.6}>
          <div className="footer-card">
          {/* Top Primary Row: Branding & Social Pills */}
          <div className="footer-primary-row">
            {/* Left Column: Attribution */}
            <div className="footer-branding">
              <div className="footer-title">
                <span className="footer-author-name">© {CURRENT_YEAR} {personal.name || 'Ayush Aryan'}</span>
                <span className="footer-brand-dot" />
              </div>

              <div className="footer-copy-text">
                <span>Built with Love & Late-Night Commits.</span>
              </div>
            </div>

            {/* Right Column: Social Pills */}
            <div className="footer-actions">
              {/* Luminous Specular GitHub Pill Button */}
              <a
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                className="footer-github-pill"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                title="Follow on GitHub (@ayusharyan)"
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>

              {/* Minimal Square X / Twitter Button */}
              <a
                href={twitterLink}
                target="_blank"
                rel="noreferrer"
                className="footer-icon-square"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                title="Follow on Twitter / X"
                aria-label="Twitter / X"
              >
                <TwitterIcon size={13} />
              </a>

              {/* Minimal Square LinkedIn Button */}
              <a
                href={linkedinLink}
                target="_blank"
                rel="noreferrer"
                className="footer-icon-square"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                title="Connect on LinkedIn"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={14} />
              </a>

              {/* Back to Top Button right beside LinkedIn */}
              <button
                onClick={scrollToTop}
                onMouseEnter={() => sound.playHover()}
                className="footer-back-to-top"
                title="Scroll back to top"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </footer>
);
}
