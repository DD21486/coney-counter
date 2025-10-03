'use client';

import React from 'react';
import { LockOutlined } from '@ant-design/icons';

interface AchievementCardProps {
  title: string;
  description: string;
  isAchieved: boolean;
  unlockedAt?: string | null;
  className?: string;
}

export default function AchievementCard({ 
  title, 
  description, 
  isAchieved, 
  unlockedAt,
  className = '' 
}: AchievementCardProps) {
  return (
    <div 
      className={`
        relative rounded-lg p-4 border-2 transition-all duration-500 w-full max-w-sm mx-auto cursor-pointer
        ${isAchieved 
          ? 'shadow-lg hover:shadow-xl hover:scale-105' 
          : 'shadow-sm hover:shadow-md'
        }
        ${className}
      `}
      style={{
        background: isAchieved 
          ? 'linear-gradient(135deg, #E8F8F0 0%, #F8FDF9 15%, #E8F8F0 25%, #F0FDF4 59%, #E8F8F0 77%, #E8F8F0 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f4 100%)',
        borderColor: isAchieved ? '#67D556' : '#d1d5db',
        borderRadius: '8px',
        boxShadow: isAchieved 
          ? '0 8px 25px rgba(103, 213, 86, 0.15), 0 4px 12px rgba(103, 213, 86, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: isAchieved ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (isAchieved) {
          e.currentTarget.style.background = 'linear-gradient(145deg, #E8F8F0 0%, #F8FDF9 20%, #E8F8F0 35%, #F0FDF4 65%, #E8F8F0 85%, #E8F8F0 100%)';
        }
      }}
      onMouseLeave={(e) => {
        if (isAchieved) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #E8F8F0 0%, #F8FDF9 15%, #E8F8F0 25%, #F0FDF4 59%, #E8F8F0 77%, #E8F8F0 100%)';
        }
      }}
    >
      {/* Metallic shine overlay for achieved cards */}
      {isAchieved && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%)',
            borderRadius: 'inherit'
          }}
        />
      )}
      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div 
          className={`
            w-12 h-12 rounded-full flex items-center justify-center relative
            ${isAchieved 
              ? 'shadow-lg' 
              : 'shadow-sm'
            }
          `}
          style={{
            background: isAchieved 
              ? 'linear-gradient(135deg, #67D556 0%, #A5FA98 100%)'
              : 'linear-gradient(135deg, #d1d5db 0%, #e5e7eb 100%)',
            boxShadow: isAchieved 
              ? '0 4px 12px rgba(103, 213, 86, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              : '0 2px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Metallic shine overlay for achieved icons */}
          {isAchieved && (
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)'
              }}
            />
          )}
          {isAchieved ? (
            <img 
              src="/Coney_color.svg" 
              alt="Achievement" 
              className="w-8 h-8 relative z-10"
            />
          ) : (
            <LockOutlined 
              className={`
                text-xl relative z-10
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
            text-xs leading-tight mb-1
            ${isAchieved ? 'text-gray-600' : 'text-gray-500'}
          `}
        >
          {description || 'Achievement Description'}
        </p>
        {isAchieved && unlockedAt && (
          <p className="text-xs text-gray-400 leading-tight">
            Earned {new Date(unlockedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        )}
      </div>
    </div>
  );
}
