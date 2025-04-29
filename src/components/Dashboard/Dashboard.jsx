import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [savedResumes, setSavedResumes] = useState([]);

  const templates = [
    {
      id: '1',
      type: 'fresher',
      title: 'Fresher Resume Template',
      description: 'Perfect for recent graduates and those with little or no experience.'
    },
    {
      id: '2',
      type: 'experienced',
      title: 'Experienced Resume Template',
      description: 'Ideal for professionals with work experience who want a strong resume.'
    },
    {
      id: '3',
      type: 'non-it',
      title: 'Non-IT Resume Template',
      description: 'Best suited for roles outside the IT industry like marketing, sales, HR, etc.'
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTemplateSelect = (templateType) => {
    navigate(`/resume-builder/${templateType}`);
  };

  const fetchSavedResumes = async () => {
    try {
      const token = localStorage.getItem('token'); // ✅ IMPORTANT: Always send token
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/resume', {  // ✅ Correct API URL
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedResumes(response.data?.resumes || []);
    } catch (error) {
      console.error('Error fetching saved resumes:', error);
      setSavedResumes([]);
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      const token = localStorage.getItem('token'); // ✅ send token on delete also
      await axios.delete(`http://localhost:5000/api/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Logout Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Choose Your Resume Template
      </h1>

      {/* Templates Grid */}
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="templates">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center"
            >
              {templates.map((template, index) => (
                <Draggable key={template.id} draggableId={template.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => handleTemplateSelect(template.type)}
                      className="bg-white border-2 border-gray-300 p-6 rounded-2xl hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
                    >
                      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                        {template.title}
                      </h2>
                      <p className="text-gray-600">{template.description}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Saved Resumes Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Saved Resumes
        </h2>

        {savedResumes && savedResumes.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {savedResumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white border-2 border-gray-300 w-80 p-6 rounded-2xl hover:shadow-xl transition-all relative"
              >
                <h3 className="text-xl font-semibold capitalize mb-2">
                  {resume.templateType} Resume
                </h3>
                <p className="text-gray-500 mb-4">{resume.resumeData?.fullName}</p> {/* ✅ resumeData not formData */}

                <div className="flex justify-between">
                  <button
                    onClick={() => navigate(`/view-resume/${resume._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteResume(resume._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No saved resumes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
