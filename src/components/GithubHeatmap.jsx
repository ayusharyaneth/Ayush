import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GithubIcon, ExternalLinkIcon } from './Icons';
import cachedFallbackData from '../data/githubContributions.json';
import './GithubHeatmap.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format YYYY-MM-DD into "MMM D, YYYY" (e.g. "Oct 15, 2026")
 * Avoids timezone drift by splitting strings directly.
 */
function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${MONTH_NAMES[monthIdx]} ${day}, ${year}`;
}

export default function GithubHeatmap({
  username = 'ayusharyaneth',
  profileUrl = 'https://github.com/ayusharyaneth/',
  style = {}
}) {
  const containerRef = useRef(null);

  // Initialize with Ayush's real cached data from storage or fallback JSON
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(`github_contrib_${username}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.contributions?.length) {
          return parsed;
        }
      }
    } catch {
      // Fall through to bundled fallback
    }
    return cachedFallbackData;
  });

  const [hoveredCell, setHoveredCell] = useState(null);

  // Fetch fresh live activity from the public GitHub Contributions API
  useEffect(() => {
    let isMounted = true;
    const fetchContributions = async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!res.ok) return;
        const fresh = await res.json();
        if (fresh?.contributions?.length && isMounted) {
          setData(fresh);
          try {
            localStorage.setItem(`github_contrib_${username}`, JSON.stringify(fresh));
          } catch {
            // Ignore quota errors
          }
        }
      } catch {
        // Fallback already loaded, fail silently
      }
    };

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Transform raw contribution days into 53 weeks (Sunday-Saturday)
  const { weeks, monthLabels, totalCommits } = useMemo(() => {
    const rawContributions = data?.contributions || [];
    if (!rawContributions.length) {
      return { weeks: [], monthLabels: [], totalCommits: 0 };
    }

    // Ensure sorted chronologically
    const sorted = [...rawContributions].sort((a, b) => a.date.localeCompare(b.date));

    // Pad beginning so week 0 aligns with Sunday (0 = Sun)
    const firstDate = new Date(`${sorted[0].date}T00:00:00`);
    const startDayOfWeek = firstDate.getDay();

    const padded = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      padded.push(null);
    }
    padded.push(...sorted);

    // Group into 7-day columns
    const weekColumns = [];
    for (let i = 0; i < padded.length; i += 7) {
      const chunk = padded.slice(i, i + 7);
      while (chunk.length < 7) {
        chunk.push(null);
      }
      weekColumns.push(chunk);
    }

    // Determine month label positions aligned with the week index
    const rawMonthLabels = [];
    weekColumns.forEach((week, wIdx) => {
      const firstValidDay = week.find((day) => day !== null);
      if (!firstValidDay) return;

      const mIdx = parseInt(firstValidDay.date.split('-')[1], 10) - 1;
      const monthLabel = MONTH_NAMES[mIdx];
      const prev = rawMonthLabels[rawMonthLabels.length - 1];

      if (wIdx === 0 || !prev || prev.label !== monthLabel) {
        rawMonthLabels.push({ weekIndex: wIdx, label: monthLabel });
      }
    });

    // Filter month labels to avoid visual overlapping
    const filteredMonthLabels = rawMonthLabels.filter((item, idx) => {
      if (idx === 0) {
        return rawMonthLabels[1] ? rawMonthLabels[1].weekIndex - item.weekIndex >= 2 : true;
      }
      if (idx === rawMonthLabels.length - 1) {
        return weekColumns.length - item.weekIndex >= 2;
      }
      return true;
    });

    // Compute total commits from data.total or by summing counts
    const computedTotal =
      data?.total?.lastYear ??
      sorted.reduce((acc, curr) => acc + (curr.count || 0), 0);

    return {
      weeks: weekColumns,
      monthLabels: filteredMonthLabels,
      totalCommits: computedTotal
    };
  }, [data]);

  // Chanh Dai & Portfolio Cyan-Accent Cell Colors
  const getCellColor = (level) => {
    switch (level) {
      case 1:
        return 'rgba(56, 189, 248, 0.28)';
      case 2:
        return 'rgba(56, 189, 248, 0.52)';
      case 3:
        return 'rgba(56, 189, 248, 0.78)';
      case 4:
        return 'var(--accent, #38bdf8)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  };

  // SVG Dimension Metrics
  const BLOCK_SIZE = 11;
  const BLOCK_MARGIN = 3;
  const BLOCK_RADIUS = 2;
  const LABEL_HEIGHT = 18;
  const WEEKDAY_WIDTH = 28;

  const totalWidth = WEEKDAY_WIDTH + weeks.length * (BLOCK_SIZE + BLOCK_MARGIN) - BLOCK_MARGIN;
  const totalHeight = LABEL_HEIGHT + 7 * (BLOCK_SIZE + BLOCK_MARGIN) - BLOCK_MARGIN;

  // Handle cell hover positioning for floating tooltip
  const handleCellMouseEnter = (e, day) => {
    if (!day || !containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft || 0;

    setHoveredCell({
      ...day,
      formattedDate: formatDateLabel(day.date),
      x: rect.left - containerRect.left + scrollLeft + rect.width / 2,
      y: rect.top - containerRect.top
    });
  };


  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  const openProfile = () => {
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="github-contributions-card" style={style}>
      {/* Header Bar */}
      <div className="github-contributions-header">
        <div className="github-contributions-title-group">
          <div className="github-icon-badge" title="Verified GitHub Activity">
            <GithubIcon size={18} />
          </div>

          <div>
            <div className="github-contributions-title">
              <span>Open Source Activity</span>
              <span className="github-live-badge">
                <span className="github-live-dot" />
                Live
              </span>
            </div>

            <div className="github-contributions-subtitle">
              {hoveredCell ? (
                <span>
                  <strong>
                    {hoveredCell.count === 0 ? 'No contributions' : `${hoveredCell.count} contribution${hoveredCell.count > 1 ? 's' : ''}`}
                  </strong>{' '}
                  on {hoveredCell.formattedDate}
                </span>
              ) : (
                <span>
                  <strong>{totalCommits.toLocaleString()} contributions</strong> in the last year
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Link Button */}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-link"
          title={`View ${username} on GitHub`}
        >
          <GithubIcon size={13} />
          <span>@{username}</span>
          <ExternalLinkIcon size={12} style={{ opacity: 0.6 }} />
        </a>
      </div>

      {/* Contribution Heatmap Calendar Grid */}
      <div className="github-calendar-container" ref={containerRef}>
        <svg
          className="github-calendar-svg"
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        >
          <title>GitHub Contributions - @{username}</title>

          {/* Month Labels */}
          <g className="github-month-labels">
            {monthLabels.map(({ label, weekIndex }) => (
              <text
                key={`m-${weekIndex}`}
                x={WEEKDAY_WIDTH + (BLOCK_SIZE + BLOCK_MARGIN) * weekIndex}
                y={11}
                className="github-month-text"
              >
                {label}
              </text>
            ))}
          </g>

          {/* Weekday Labels (Mon, Wed, Fri) */}
          <g className="github-weekday-labels">
            <text x={0} y={LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * 1 + 9} className="github-weekday-text">
              Mon
            </text>
            <text x={0} y={LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * 3 + 9} className="github-weekday-text">
              Wed
            </text>
            <text x={0} y={LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * 5 + 9} className="github-weekday-text">
              Fri
            </text>
          </g>

          {/* Contribution Cells (53 weeks x 7 days) */}
          <g className="github-cells">
            {weeks.map((week, wIdx) =>
              week.map((day, dIdx) => {
                if (!day) return null;
                const posX = WEEKDAY_WIDTH + (BLOCK_SIZE + BLOCK_MARGIN) * wIdx;
                const posY = LABEL_HEIGHT + (BLOCK_SIZE + BLOCK_MARGIN) * dIdx;

                return (
                  <rect
                    key={`${wIdx}-${dIdx}-${day.date}`}
                    x={posX}
                    y={posY}
                    width={BLOCK_SIZE}
                    height={BLOCK_SIZE}
                    rx={BLOCK_RADIUS}
                    ry={BLOCK_RADIUS}
                    fill={getCellColor(day.level)}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="0.5"
                    className="github-day-block"
                    data-date={day.date}
                    data-count={day.count}
                    data-level={day.level}
                    onMouseEnter={(e) => handleCellMouseEnter(e, day)}
                    onMouseLeave={handleCellMouseLeave}
                    onClick={openProfile}
                  >
                    <title>
                      {day.count === 0 ? 'No contributions' : `${day.count} contribution${day.count > 1 ? 's' : ''}`} on {formatDateLabel(day.date)}
                    </title>
                  </rect>
                );
              })
            )}
          </g>
        </svg>

        {/* Floating Tooltip Bubble */}
        {hoveredCell && (
          <div
            className="github-heatmap-tooltip"
            style={{
              left: `${hoveredCell.x}px`,
              top: `${Math.max(22, hoveredCell.y - 8)}px`
            }}
          >
            <div className="github-heatmap-tooltip-bubble">
              <strong>
                {hoveredCell.count === 0 ? 'No contributions' : `${hoveredCell.count} contribution${hoveredCell.count > 1 ? 's' : ''}`}
              </strong>{' '}
              on {hoveredCell.formattedDate}
            </div>
            <div className="github-heatmap-tooltip-arrow" />
          </div>
        )}
      </div>
    </div>

  );
}
