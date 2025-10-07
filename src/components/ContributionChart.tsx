'use client';

import { useState } from 'react';
import { Tooltip } from 'antd';

interface ContributionChartProps {
  data: { date: string; count: number }[];
  year: number;
}

export default function ContributionChart({ data, year }: ContributionChartProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Create a map of date to count for quick lookup
  const dataMap = new Map(data.map(item => [item.date, item.count]));

  // Generate all days of the year in a GitHub-style grid
  const generateYearGrid = () => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Find the first Sunday of the year (GitHub starts weeks on Sunday)
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks = [];
    let currentWeek = new Date(firstSunday);
    
    // Generate 53 weeks (some years need 53 weeks)
    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      
      // Generate 7 days for this week
      for (let day = 0; day < 7; day++) {
        const currentDay = new Date(currentWeek);
        currentDay.setDate(currentWeek.getDate() + day);
        
        // Only include days that are actually in the year
        if (currentDay.getFullYear() === year) {
          const dateStr = currentDay.toISOString().split('T')[0];
          const count = dataMap.get(dateStr) || 0;
          
          weekDays.push({
            date: dateStr,
            count,
            dayOfWeek: day,
            weekOfYear: week,
            actualDate: new Date(currentDay)
          });
        } else {
          weekDays.push(null); // Empty slot for days outside the year
        }
      }
      
      weeks.push(weekDays);
      currentWeek.setDate(currentWeek.getDate() + 7); // Move to next week
    }
    
    return weeks;
  };

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const getColorClass = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-white/10';
      case 1: return 'bg-blue-400/60';
      case 2: return 'bg-blue-500/70';
      case 3: return 'bg-blue-600/80';
      case 4: return 'bg-blue-700/90';
      default: return 'bg-white/10';
    }
  };

  const weeks = generateYearGrid();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate month positions
  const getMonthPositions = () => {
    const positions = [];
    let currentWeek = 0;
    
    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(year, month, 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      
      // Find which week this month starts in
      const monthStartWeek = Math.floor((firstDayOfMonth.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      positions.push({
        month: monthLabels[month],
        weekStart: monthStartWeek,
        leftPosition: monthStartWeek * 13 // 13px per week
      });
    }
    
    return positions;
  };

  const monthPositions = getMonthPositions();

  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          Your {year} Coney Crushing Chart ({data.reduce((sum, item) => sum + item.count, 0)} Coneys in '{year.toString().slice(-2)})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Chart grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2">
              {dayLabels.map((day, index) => (
                <div key={day} className="h-3 text-xs text-white/70 mb-0.5">
                  {index % 2 === 0 ? day : ''}
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col mr-1">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={dayIndex} className="w-3 h-3 mb-0.5"></div>;
                    }

                    const intensity = getIntensity(day.count);
                    const isHovered = hoveredDate === day.date;

                    return (
                      <Tooltip
                        key={dayIndex}
                        title={
                          <div className="text-center">
                            <div className="font-semibold">
                              {day.actualDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-blue-400">
                              {day.count} {day.count === 1 ? 'coney' : 'coneys'}
                            </div>
                          </div>
                        }
                        placement="top"
                      >
                        <div
                          className={`w-3 h-3 mb-0.5 rounded-sm cursor-pointer transition-all duration-200 ${
                            getColorClass(intensity)
                          } ${isHovered ? 'ring-2 ring-white/30 ring-opacity-50' : ''}`}
                          onMouseEnter={() => setHoveredDate(day.date)}
                          onMouseLeave={() => setHoveredDate(null)}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}