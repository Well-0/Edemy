import type { Lesson } from '../types/Lesson';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  async health(): Promise<{ status: string; message: string }> {
    console.log('[API] Checking health...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('[API] Health response:', data);
    return data;
  },

  async getLessons(): Promise<Lesson[]> {
    console.log('[API] Fetching lessons...');
    const response = await fetch(`${API_BASE_URL}/lessons`);
    if (!response.ok) {
      console.error('[API] Failed to fetch lessons:', response.status);
      throw new Error('Failed to fetch lessons');
    }
    const data = await response.json();
    console.log('[API] Lessons fetched:', data);
    return data;
  },

  async getLesson(id: number): Promise<Lesson> {
    console.log(`[API] Fetching lesson ${id}...`);
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`);
    if (!response.ok) {
      console.error(`[API] Lesson ${id} not found:`, response.status);
      throw new Error('Lesson not found');
    }
    const data = await response.json();
    console.log(`[API] Lesson ${id} fetched:`, data);
    return data;
  },

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
    console.log('[API] Creating lesson:', lesson);
    const response = await fetch(`${API_BASE_URL}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson),
    });
    if (!response.ok) {
      console.error('[API] Failed to create lesson:', response.status);
      throw new Error('Failed to create lesson');
    }
    const data = await response.json();
    console.log('[API] Lesson created:', data);
    return data;
  },
};