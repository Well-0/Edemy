import type { Lesson } from '../types/Lesson';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  async health(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  async getLessons(): Promise<Lesson[]> {
    const response = await fetch(`${API_BASE_URL}/lessons`);
    if (!response.ok) throw new Error('Failed to fetch lessons');
    return response.json();
  },

  async getLesson(id: number): Promise<Lesson> {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`);
    if (!response.ok) throw new Error('Lesson not found');
    return response.json();
  },

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
    const response = await fetch(`${API_BASE_URL}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson),
    });
    if (!response.ok) throw new Error('Failed to create lesson');
    return response.json();
  },
};