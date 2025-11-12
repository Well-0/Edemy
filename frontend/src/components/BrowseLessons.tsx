import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Course {
  name: string;
  path: string;
  fileCount?: number;
}
//TODO: Make Virtual Save State by Saving Json and Loading it, Tracking back to last opened lesson
//TODO: Should Read AppData Edemy and Load Courses from there
export default function BrowseLessons() {
  const { isDark } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/courses');
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error('[BrowseLessons] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className={`container py-5 ${isDark ? 'text-light' : ''}`}>
      <h1 className="mb-4">Browse Courses</h1>
      
      {courses.length === 0 ? (
        <div className="alert alert-info">
          No courses found. Upload a course from the Home page.
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className={`card h-100 ${isDark ? 'bg-dark text-light border-secondary' : ''}`}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <span className="fs-1 me-3">📚</span>
                    <h5 className="card-title mb-0">{course.name}</h5>
                  </div>
                  <p className="card-text text-muted">
                    <small>{course.path}</small>
                  </p>
                  {course.fileCount && (
                    <span className="badge bg-primary">{course.fileCount} files</span>
                  )}
                </div>
                <div className="card-footer">
                  <button className="btn btn-sm btn-primary w-100">
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}