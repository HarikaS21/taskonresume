import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SavedBuilder = () => {
  const [savedResumes, setSavedResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedResumes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to view your saved resumes.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/resume/load', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setSavedResumes(response.data.resumes);
        }
      } catch (error) {
        console.error('Error fetching saved resumes:', error);
        alert('Failed to load saved resumes.');
      }
    };

    fetchSavedResumes();
  }, []);

  const handleViewResume = (resumeId) => {
    navigate(`/resume/${resumeId}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Saved Resumes</h1>

      {savedResumes.length === 0 ? (
        <p>No resumes saved yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedResumes.map((resume) => (
            <div key={resume._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold capitalize">{resume.templateType} Resume</h2>
              <button
                onClick={() => handleViewResume(resume._id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Resume
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBuilder;
