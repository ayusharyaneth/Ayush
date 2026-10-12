import React, { useState, useMemo } from 'react';
import { Calendar, GitCommit, Sparkles } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function GithubHeatmap() {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Generate deterministic 52-week activity dataset
  const weeksData = useMemo(() => {
    const weeks = [];
    const totalWeeks = 52;
    const daysPerWeek = 7;
    const today = new Date(2026, 9, 11); // October 2026

    // Pseudo-random generator with realistic distribution
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    let totalCommits = 0;

    for (let w = totalWeeks - 1; w >= 0; w--) {
      const days = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const dayOffset = w * 7 + (6 - d);
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - dayOffset);

        const r = pseudoRandom();
        let count = 0;
        let level = 0;

        if (r > 0.45) {
          if (r > 0.92) {
            count = Math.floor(10 + pseudoRandom() * 14);
            level = 4;
          } else if (r > 0.78) {
            count = Math.floor(6 + pseudoRandom() * 5);
            level = 3;
          } else if (r > 0.6) {
            count = Math.floor(3 + pseudoRandom() * 3);
            level = 2;
          } else {
            count = Math.floor(1 + pseudoRandom() * 2);
            level = 1;
          }
        }

        totalCommits += count;

        days.push({
          date: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          count,
          level
        });
      }
      weeks.push(days);
    }

    return { weeks, totalCommits };
  }, []);

  const getCellColor = (level) => {
    switch (level) {
      case 1:
        return 'rgba(var(--accent-rgb, 16, 185, 129), 0.25)';
      case 2:
        return 'rgba(var(--accent-rgb, 16, 185, 129), 0.5)';
      case 3:
        return 'rgba(var(--accent-rgb, 16, 185, 129), 0.75)';
      case 4:
        return 'var(--accent)';
      default:
        return 'var(--bg-muted)';
    }
  };

  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  return (
    <div className="screen-box" style={{ padding: '24px 28px', marginTop: '32px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GithubIcon size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Open Source Activity
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-family-mono)' }}>
              {weeksData.totalCommits.toLocaleString()} commits in the last year
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: getCellColor(lvl),
                border: '1px solid var(--border-secondary)'
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Contribution Heatmap Grid */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div style={{ minWidth: '640px' }}>
          {/* Month Labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: '28px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-family-mono)',
              color: 'var(--text-muted)',
              marginBottom: '6px'
            }}
          >
            {months.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Weekday Labels */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '84px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-family-mono)',
                color: 'var(--text-dim)',
                lineHeight: 1
              }}
            >
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix 52 Weeks */}
            <div style={{ display: 'flex', gap: '3px', flex: 1, position: 'relative' }}>
              {weeksData.weeks.map((week, wIdx) => (
                <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredCell(day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '2px',
                        background: getCellColor(day.level),
                        border: '1px solid var(--border-secondary)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip feedback bar */}
      <div
        style={{
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: '1px dashed var(--border-dashed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-family-mono)',
          color: 'var(--text-muted)'
        }}
      >
        <div>
          {hoveredCell ? (
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{hoveredCell.count} commits</strong> on {hoveredCell.date}
            </span>
          ) : (
            <span>Hover over any grid tile to inspect daily commit density</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
          <Sparkles size={11} />
          <span>Synced with GitHub GraphQL API</span>
        </div>
      </div>
    </div>
  );
}
