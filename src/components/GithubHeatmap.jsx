import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { GithubIcon, ExternalLinkIcon } from './Icons';
import { sound } from '../utils/soundEffects';
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
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState(null);

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

  // Transform raw contribution days into calendar weeks (starting from 1 Jan 2026)
  const { weeks, monthLabels, totalCommits } = useMemo(() => {
    const rawContributions = data?.contributions || [];
    if (!rawContributions.length) {
      return { weeks: [], monthLabels: [], totalCommits: 0 };
    }

    // Filter to start strictly from 1 Jan 2026 (omits empty days prior to this date)
    const filteredByDate = rawContributions.filter(
      (day) => day && day.date >= '2026-01-01'
    );

    // Ensure sorted chronologically
    const sorted = [...filteredByDate].sort((a, b) => a.date.localeCompare(b.date));

    if (!sorted.length) {
      return { weeks: [], monthLabels: [], totalCommits: 0 };
    }

    // Pad beginning so week 0 starts from row 0 (filling all 7 rows starting at the top)
    const firstDate = new Date(`${sorted[0].date}T00:00:00`);
    const startDayOfWeek = firstDate.getDay();

    const padded = [];
    for (let i = startDayOfWeek; i > 0; i--) {
      const padDate = new Date(firstDate);
      padDate.setDate(padDate.getDate() - i);
      const yyyy = padDate.getFullYear();
      const mm = String(padDate.getMonth() + 1).padStart(2, '0');
      const dd = String(padDate.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const existing = rawContributions.find((d) => d && d.date === dateStr);
      padded.push(existing || { date: dateStr, count: 0, level: 0 });
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
      const janDay = week.find((day) => day && day.date.startsWith('2026-01'));
      const activeDay = (wIdx === 0 && janDay) ? janDay : week.find((day) => day !== null);
      if (!activeDay) return;

      const mIdx = parseInt(activeDay.date.split('-')[1], 10) - 1;
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

    // Compute total commits by summing counts across 2026
    const computedTotal = sorted
      .filter((day) => day && day.date >= '2026-01-01')
      .reduce((acc, curr) => acc + (curr.count || 0), 0);

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

  // Handle cell hover positioning for floating tooltip (relative to cardRef)
  const handleCellMouseEnter = (e, day) => {
    if (!day || !cardRef.current) return;
    sound.playHover();
    const cellRect = e.currentTarget.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    setHoveredCell({
      ...day,
      formattedDate: formatDateLabel(day.date),
      cellCenterX: cellRect.left - cardRect.left + cellRect.width / 2,
      cellTopY: cellRect.top - cardRect.top
    });
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
    setTooltipPos(null);
  };

  // Hide floating tooltip while horizontally scrolling on mobile/smaller screens
  const handleContainerScroll = () => {
    if (hoveredCell) {
      setHoveredCell(null);
      setTooltipPos(null);
    }
  };

  // Dynamically clamp tooltip bubble within card edges and align pointer arrow to cell
  useLayoutEffect(() => {
    if (!hoveredCell || !cardRef.current || !tooltipRef.current) {
      setTooltipPos(null);
      return;
    }

    const cardRect = cardRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || 190;
    const halfWidth = tooltipWidth / 2;

    // Keep bubble securely inside the card boundaries with 14px padding
    const minCenter = halfWidth + 14;
    const maxCenter = Math.max(minCenter, cardRect.width - halfWidth - 14);

    const clampedCenter = Math.max(minCenter, Math.min(hoveredCell.cellCenterX, maxCenter));
    const rawArrowOffset = hoveredCell.cellCenterX - clampedCenter;
    // Keep arrow within bubble borders (with 14px margin from bubble corners)
    const maxArrowShift = Math.max(0, halfWidth - 14);
    const arrowOffset = Math.max(-maxArrowShift, Math.min(rawArrowOffset, maxArrowShift));

    setTooltipPos({
      left: clampedCenter,
      top: hoveredCell.cellTopY - 6,
      arrowOffset
    });
  }, [hoveredCell]);

  return (
    <div className="github-contributions-card" ref={cardRef} style={style}>
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
                  <strong>{totalCommits.toLocaleString()} contributions</strong> in 2026
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
          onMouseEnter={() => sound.playHover()}
          onClick={() => sound.playClick()}
        >
          <GithubIcon size={13} />
          <span>@{username}</span>
          <ExternalLinkIcon size={12} style={{ opacity: 0.6 }} />
        </a>
      </div>

      {/* Contribution Heatmap Calendar Grid */}
      <div className="github-calendar-container" ref={containerRef} onScroll={handleContainerScroll}>
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

          {/* Contribution Cells (weeks x 7 days) */}
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
                    aria-label={`${day.count === 0 ? 'No contributions' : `${day.count} contribution${day.count > 1 ? 's' : ''}`} on ${formatDateLabel(day.date)}`}
                    onMouseEnter={(e) => handleCellMouseEnter(e, day)}
                    onMouseLeave={handleCellMouseLeave}
                  />
                );
              })
            )}
          </g>
        </svg>
      </div>

      {/* Floating Tooltip Bubble (positioned relative to cardRef and clamped within card borders) */}
      {hoveredCell && (
        <div
          ref={tooltipRef}
          className="github-heatmap-tooltip"
          style={{
            left: tooltipPos ? `${tooltipPos.left}px` : `${hoveredCell.cellCenterX}px`,
            top: tooltipPos ? `${tooltipPos.top}px` : `${hoveredCell.cellTopY - 6}px`,
            opacity: tooltipPos ? 1 : 0,
            visibility: tooltipPos ? 'visible' : 'hidden'
          }}
        >
          <div className="github-heatmap-tooltip-bubble">
            <strong>
              {hoveredCell.count === 0 ? 'No contributions' : `${hoveredCell.count} contribution${hoveredCell.count > 1 ? 's' : ''}`}
            </strong>{' '}
            on {hoveredCell.formattedDate}
          </div>
          <div
            className="github-heatmap-tooltip-arrow"
            style={{
              transform: tooltipPos ? `translateX(${tooltipPos.arrowOffset}px)` : 'none'
            }}
          />
        </div>
      )}
    </div>

  );
}
