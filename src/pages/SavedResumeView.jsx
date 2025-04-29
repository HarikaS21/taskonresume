import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SavedResumeView = () => {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to view the resume.');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/resume/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setResumeData(response.data.resume.resumeData);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        alert('Failed to load resume.');
      }
    };

    fetchResume();
  }, [id]);

  if (!resumeData) {
    return <div className="min-h-screen p-6 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {resumeData.photo && (
          <div className="flex justify-center mb-6">
            <img src={resumeData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2">{resumeData.fullName}</h1>
        <p className="text-gray-700 mb-4">{resumeData.email} | {resumeData.phone} | {resumeData.address}</p>

        <hr className="my-4" />

        {resumeData.education && resumeData.education.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            {resumeData.education.map((edu, idx) => (
              <p key={idx} className="mb-2">{edu.degree} - {edu.school} ({edu.year})</p>
            ))}
            <hr className="my-4" />
          </>
        )}

        {resumeData.skills && (
          <>
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <ul className="list-disc ml-6 mb-4">
              {resumeData.skills.split(',').map((skill, idx) => (
                <li key={idx}>{skill.trim()}</li>
              ))}
            </ul>
            <hr className="my-4" />
          </>
        )}

        {resumeData.achievements && (
          <>
            <h2 className="text-xl font-semibold mb-2">Achievements</h2>
            <p className="mb-4">{resumeData.achievements}</p>
            <hr className="my-4" />
          </>
        )}

        {resumeData.activities && (
          <>
            <h2 className="text-xl font-semibold mb-2">Extra Curricular Activities</h2>
            <p>{resumeData.activities}</p>
          </>
        )}
        
      </div>
    </div>
  );
};

export default SavedResumeView;
