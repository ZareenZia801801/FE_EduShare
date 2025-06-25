import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function FileDetails() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/files/fileDetails/${id}`);
        const data = await response.json();
        setFile(data.fileMetadata);
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching file details:", error);
      } finally {
        setLoading(false);

        // ✅ Force layout repaint after data load
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 100);
      }
    };

    fetchFileDetails();
  }, [id]);


  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const formData = new URLSearchParams();
    formData.append("fileId", id);
    formData.append("username", "Anonymous"); // or dynamic user
    formData.append("text", newComment);

    try {
      const response = await fetch("http://localhost:8080/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const savedComment = await response.json();
      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to post comment. Try again.");
    }
  };


  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8080/files/download?fileName=${fileName}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    }
  };


  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/comments/delete/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      alert("Failed to delete comment.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading file information...</p>;
  if (!file) return <p>No file found with ID: {id}</p>;

  return (
    <div className="file-details-wrapper">
      <div className="file-details-layout">
        <div className="file-card">
          <h2>📁 {file.title}</h2>

          <div className="file-info">
            <p><strong>Uploaded At:</strong> {new Date(file.uploadedAt).toLocaleString()}</p>
            <p><strong>File Size:</strong> {file.fileSize} KB</p>
            <p><strong>File Name:</strong> {file.fileName}</p>
            <p><strong>File Type:</strong> {file.fileType}</p>
            <p><strong>Course:</strong> {file.courseName} ({file.courseCode})</p>
            <p><strong>Instructor:</strong> {file.instructor}</p>
            <p><strong>Semester:</strong> {file.semester}</p>
            <p><strong>Department:</strong> {file.department}</p>
            <p><strong>Tags:</strong> {file.tags?.split(',').map(tag => (
              <span key={tag} className="tag">#{tag.trim()}</span>
            ))}</p>
          </div>

          <button className="download-button" onClick={() => handleDownload(file.fileName)}>
            📥 Click to Download
          </button>
        </div>

        <div className="comments-section">
          <h3>📝 Comments</h3>

          <div className="comment-box">
            <input
              type="text"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Post</button>
          </div>
      
          <ul className="comment-list">
            {[...comments].reverse().map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-content">
                  <div>
                    <strong>{comment.username}:</strong> {comment.text}
                    <div className="comment-time">{new Date(comment.postedAt).toLocaleString()}</div>
                  </div>
                  {/* <button className="delete-button" onClick={() => handleDelete(comment.id)}>❌ Delete</button> */}
                  <button className="delete-button" onClick={() => handleDelete(comment.id)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileDetails;
