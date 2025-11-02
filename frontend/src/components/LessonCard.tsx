import React from 'react';
import type { Lesson } from '../types/Lesson';
import  '../css/LessonCard.css';

interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#2ecc71';
      case 'Intermediate': return '#f39c12';
      case 'Advanced': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="lesson-card" onClick={onClick}>
      <div className="lesson-header">
        <h3>{lesson.title}</h3>
        <span 
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(lesson.difficulty) }}
        >
          {lesson.difficulty}
        </span>
      </div>
      <p className="lesson-description">{lesson.description}</p>
      <div className="lesson-footer">
        <span className="duration">⏱️ {lesson.duration} min</span>
      </div>
    </div>
  );
};