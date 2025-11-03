import React from 'react';
import type { Lesson } from '../types/Lesson';
import  '../css/LessonCard.css';

interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  return (
    <div className="lesson-card" onClick={onClick}>
      <div className="lesson-header">
        <h3>{lesson.title}</h3>
      </div>
      <p className="lesson-description">{lesson.description}</p>
      <div className="lesson-footer">
        <span className="duration">⏱️ {lesson.duration} min</span>
      </div>
    </div>
  );
};