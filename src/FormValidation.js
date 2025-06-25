import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';

function FormValidation() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [fileCount, setFileCount] = useState(0);
  const [userCount, setUserCount] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  // // Fetch file count from server
  // useEffect(() => {
  //   const fetchFileCount = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/files/count`);
  //       const data = await response.json();
  //       setFileCount(data.count);
  //     } catch (err) {
  //       console.error('Error fetching file count:', err);
  //     }
  //   };
  //   fetchFileCount();
  // }, [API_BASE_URL]);

  // Fetch user count from server
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [fileRes, userRes] = await Promise.all([
          fetch(`${API_BASE_URL}/files/fileCount`),
          fetch(`${API_BASE_URL}/api/auth/userCount`)
        ]);
  
        const fileData = await fileRes.json();
        const userData = await userRes.json();
        console.log("userData:", userData);
  
        setFileCount(fileData.count);
        setUserCount(userData.count); 
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };
    fetchCounts();
  }, [API_BASE_URL]);
  
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('title', data.title);
      formData.append('courseCode', data.courseCode);
      formData.append('courseName', data.courseName);
      formData.append('instructor', data.instructor);
      formData.append('department', data.department);
      formData.append('semester', data.semester);
      formData.append('tags', data.tags);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        reset();
        const updatedCount = await fetch(`${API_BASE_URL}/files/count`);
        const countData = await updatedCount.json();
        setFileCount(countData.count);
      } else {
        const errorText = await response.text();
        alert('Upload failed: ' + errorText);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Something went wrong. See console for details.');
    }
  };

  return (
    <div className="main-content">

      {/* left panel */}
      <div class="left-panel">
        <div class="left-card welcome">
          <h3>Welcome</h3>
          <p>Welcome to the Dashboard</p>
        </div>

        <div class="left-card stats">
          <h3>📊Total Files Uploaded:</h3>
          <h1>{fileCount}</h1>
        </div>

        <div class="left-card stats">
          <h3>📊 Total Users</h3>
          <h1>{userCount !== null ? userCount : 'Loading...'}</h1>
        </div>
      </div>


      {/* right-panel */}
      <div className="right-panel">
        <div className="form-container">
          <h2>📁 Upload Study Material</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input type="text" {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="error">{errors.title.message}</p>}
              </div>
              <div className="form-group">
                <label>Course Code</label>
                <input type="text" {...register('courseCode', { required: 'Course Code is required' })} />
                {errors.courseCode && <p className="error">{errors.courseCode.message}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course Name</label>
                <input type="text" {...register('courseName', { required: 'Course Name is required' })} />
                {errors.courseName && <p className="error">{errors.courseName.message}</p>}
              </div>
              <div className="form-group">
                <label>Instructor Name</label>
                <input type="text" {...register('instructor', { required: 'Instructor Name is required' })} />
                {errors.instructor && <p className="error">{errors.instructor.message}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <input type="text" {...register('department', { required: 'Department is required' })} />
                {errors.department && <p className="error">{errors.department.message}</p>}
              </div>
              <div className="form-group">
                <label>Semester</label>
                <input type="text" {...register('semester', { required: 'Semester is required' })} />
                {errors.semester && <p className="error">{errors.semester.message}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tags</label>
                <input type="text" {...register('tags')} />
              </div>
              <div className="form-group">
                <label>Select file</label>
                <input type="file" {...register('file', { required: 'Please select a file' })} />
                {errors.file && <p className="error">{errors.file.message}</p>}
              </div>
            </div>

            <button type="submit">Upload</button>
          </form>

        </div>
      </div>

    </div>
  );

}

export default FormValidation;
