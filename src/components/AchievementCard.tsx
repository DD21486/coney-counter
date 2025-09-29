'use client';

import React from 'react';
import { LockOutlined } from '@ant-design/icons';

interface AchievementCardProps {
  title: string;
  description: string;
  isAchieved: boolean;
  className?: string;
}

export default function AchievementCard({ 
  title, 
  description, 
  isAchieved, 
  className = '' 
}: AchievementCardProps) {
  return (
    <div 
      className={`
        relative bg-white rounded-lg p-4 border-2 transition-all duration-200 w-full max-w-sm mx-auto
        ${isAchieved 
          ? 'border-green-500 shadow-sm bg-green-50' 
          : 'border-gray-300 shadow-sm'
        }
        ${className}
      `}
      style={{
        borderColor: isAchieved ? '#10b981' : '#d1d5db',
        backgroundColor: isAchieved ? '#f0fdf4' : '#ffffff'
      }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div 
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${isAchieved 
              ? 'bg-green-500' 
              : 'bg-gray-300'
            }
          `}
          style={{
            backgroundColor: isAchieved ? '#10b981' : '#d1d5db'
          }}
        >
          {isAchieved ? (
            <img 
              src="/Coney_color.svg" 
              alt="Achievement" 
              className="w-8 h-8"
            />
          ) : (
            <LockOutlined 
              className={`
                text-xl
                ${isAchieved ? 'text-white' : 'text-gray-500'}
              `}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 
          className={`
            font-semibold text-sm mb-1 leading-tight
            ${isAchieved ? 'text-gray-900' : 'text-gray-900'}
          `}
        >
          {title || 'Achievement Title'}
        </h3>
        <p 
          className={`
            text-xs leading-tight
            ${isAchieved ? 'text-gray-600' : 'text-gray-500'}
          `}
        >
          {description || 'Achievement Description'}
        </p>
      </div>
    </div>
  );
}
