import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

const ResumeBuilder = () => {
  const { templateType } = useParams();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    education: [{ degree: '', school: '', location: '', year: '', grade: '' }],
    experience: [{ company: '', role: '', duration: '' }],
    skills: '',
    projects: [{ name: '', description: '' }],
    certifications: [{ name: '', issuer: '', year: '' }],
    achievements: '',
    activities: '',
    photo: null,
  });

  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArrayChange = (section, index, e) => {
    const updated = [...formData[section]];
    updated[index][e.target.name] = e.target.value;
    setFormData((prev) => ({ ...prev, [section]: updated }));
  };

  const addItem = (section) => {
    const newItem = Object.fromEntries(Object.keys(formData[section][0]).map((key) => [key, '']));
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeItem = (section, index) => {
    const updated = formData[section].filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, [section]: updated }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const downloadResume = () => {
    const resume = document.getElementById('resume-preview');

    html2canvas(resume, {
      scale: 2,
      scrollY: -window.scrollY, // Important to capture full page not just visible screen
      useCORS: true, // If your images are from external links
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('my_resume.pdf');
    });
  };



  const saveResume = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to save your resume!');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/resume/save', {
        templateType,
        resumeData: formData,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Resume saved successfully to database!');
      } else {
        alert('Failed to save resume.');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Something went wrong while saving.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize text-gray-800">Build {templateType} Resume</h1>
        <div className="flex gap-4">
          <button onClick={saveResume} className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">
            Save Resume
          </button>
          <button onClick={downloadResume} className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow space-y-6 overflow-y-auto max-h-[85vh]">
          <form className="space-y-6">
            {/* Upload Photo */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Upload Profile Photo:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
            </div>

            {/* Personal Details */}
            {['fullName', 'email', 'phone', 'address'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 font-semibold capitalize mb-1">{field}:</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </div>
            ))}

            {/* Font Options */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Select Font Color:</label>
              <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-16 h-10 p-1 border rounded" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Select Font Style:</label>
              <select className="w-full p-3 border rounded" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>

            {/* Dynamic Sections */}
            {/* Education */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Education:</label>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="space-y-2 mb-4 border p-3 rounded-md">
                  {['degree', 'school', 'location', 'year', 'grade'].map((field) => (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={edu[field]}
                      onChange={(e) => handleArrayChange('education', idx, e)}
                      className="w-full p-2 border rounded"
                    />
                  ))}
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('education', idx)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('education')}
                className="text-blue-500 hover:underline text-sm"
              >
                + Add More Education
              </button>
            </div>

            {/* Experience, Projects, Certifications */}
            {['experience', 'projects', 'certifications'].map((section) => (
              <div key={section}>
                <label className="block text-gray-700 font-semibold mb-2 capitalize">{section}:</label>
                {formData[section].map((item, idx) => (
                  <div key={idx} className="space-y-2 mb-4 border p-3 rounded-md">
                    {Object.keys(item).map((field) => (
                      <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={field}
                        value={item[field]}
                        onChange={(e) => handleArrayChange(section, idx, e)}
                        className="w-full p-2 border rounded"
                      />
                    ))}
                    {formData[section].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(section, idx)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem(section)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  + Add More {section}
                </button>
              </div>
            ))}

            {/* Text Areas */}
            {['skills', 'achievements', 'activities'].map((section) => (
              <div key={section}>
                <label className="block text-gray-700 font-semibold mb-1 capitalize">{section}:</label>
                <textarea
                  name={section}
                  placeholder={section}
                  value={formData[section]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </div>
            ))}
          </form>
        </div>

        {/* Resume Preview Section */}
        <div
          id="resume-preview"
          className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md"
          style={{ color: fontColor, fontFamily, minHeight: '100vh' }}
        >

          {formData.photo && (
            <div className="flex justify-center mb-6">
              <img src={formData.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover" />
            </div>
          )}

          <h2 className="text-3xl font-bold text-center">
            {formData.fullName || 'Your Name Here'}
          </h2>
          <p className="text-center">
            {(formData.email || 'email@example.com')} | {(formData.phone || '123-456-7890')} | {(formData.address || 'Your Address')}
          </p>

          <hr className="my-6" />

          {/* Education */}
          {formData.education.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-3">Education</h3>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-semibold">{edu.degree}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{edu.school}, {edu.year}</span>
                    <span>Grade: {edu.grade}</span>
                  </div>
                </div>
              ))}
              <hr className="my-4" />
            </>
          )}

          {/* Experience */}
          {formData.experience.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-3">Experience</h3>
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-semibold">{exp.role}</p>
                  <p className="text-sm text-gray-600">{exp.company} | {exp.duration}</p>
                </div>
              ))}
              <hr className="my-4" />
            </>
          )}

          {/* Projects */}
          {formData.projects.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-3">Projects</h3>
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-semibold">{proj.name}</p>
                  <p className="text-sm text-gray-600">- {proj.description}</p>
                </div>
              ))}
              <hr className="my-4" />
            </>
          )}

          {/* Certifications */}
          {formData.certifications.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-3">Certifications</h3>
              {formData.certifications.map((cert, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-sm text-gray-600">- Issued by {cert.issuer}, {cert.year}</p>
                </div>
              ))}
              <hr className="my-4" />
            </>
          )}

          {/* Skills */}
          {formData.skills && (
            <>
              <h3 className="text-xl font-semibold mb-3">Skills</h3>
              <ul className="list-disc ml-6 text-gray-700">
                {formData.skills.split(',').map((skill, idx) => (
                  <li key={idx} className="capitalize">{skill.trim()}</li>
                ))}
              </ul>
              <hr className="my-4" />
            </>
          )}

          {/* Achievements */}
          {formData.achievements && (
            <>
              <h3 className="text-xl font-semibold mb-3">Achievements</h3>
              <p className="text-gray-700">{formData.achievements}</p>
              <hr className="my-4" />
            </>
          )}

          {/* Activities */}
          {formData.activities && (
            <>
              <h3 className="text-xl font-semibold mb-3">Activities</h3>
              <p className="text-gray-700">{formData.activities}</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;
