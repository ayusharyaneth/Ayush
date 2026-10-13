import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './Icons';
import { sound } from '../utils/soundEffects';
import './Footer.css';

export default function Footer({ personal = {}, socials = [], onOpenConsent }) {
  const [currentTime, setCurrentTime] = useState('');

  // Live ticking IST clock (Example 2 aesthetic)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        setCurrentTime(timeStr);
      } catch {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setCurrentTime(`${hours}:${minutes}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve social URLs
  const githubLink = socials.find((s) => s.name?.toLowerCase().includes('github'))?.url || 'https://github.com/ayusharyan';
  const twitterLink = socials.find((s) => s.name?.toLowerCase().includes('twitter') || s.name?.toLowerCase().includes('x'))?.url || 'https://x.com';
  const linkedinLink = socials.find((s) => s.name?.toLowerCase().includes('linkedin'))?.url || 'https://linkedin.com';

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-card">
          {/* Top Primary Row: Branding, Social Pills & Back to Top */}
          <div className="footer-primary-row">
            {/* Left Column: Attribution & Copyright (Example 1 & Example 2) */}
            <div className="footer-branding">
              <div className="footer-title">
                <span>Designed & Developed by</span>
                <span className="footer-author-name">{personal.name || 'Ayush Aryan'}</span>
                <span className="footer-brand-dot" />
              </div>

              <div className="footer-copy-text">
                <span>© {currentYear} All rights reserved.</span>
                <span>·</span>
                <span>Built with love, late nights, coffee</span>
                {onOpenConsent && (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onOpenConsent();
                      }}
                      className="footer-cookie-btn"
                      title="Manage cookie consent & privacy preferences"
                    >
                      Privacy
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Actions & Socials (Example 1) + Back to Top */}
            <div className="footer-actions">
              {/* Luminous Specular GitHub Pill Button (Example 1) */}
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

              {/* Minimal Square X / Twitter Button (Example 1) */}
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

              {/* Minimal Square LinkedIn Button (Example 1) */}
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
            </div>
          </div>

          {/* Card Subtle Divider */}
          <div className="footer-card-divider" />

          {/* Secondary Bottom Row: Live IST Clock & Back to top button */}
          <div className="footer-secondary-row">
            <div className="footer-meta-left">
              <span className="footer-live-dot" />
              <span>
                {personal.location || 'Uttarakhand, India'}{' '}
                {currentTime ? `${currentTime} GMT+5:30` : '21:30 GMT+5:30'}
              </span>
            </div>

            <div className="footer-meta-right">
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
      </div>
    </footer>
  );
}
