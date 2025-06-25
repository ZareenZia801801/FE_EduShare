import React, { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
function UploadedFilesList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        setLoading(true);
        const queryParam = searchQuery ? `&searchTerm=${encodeURIComponent(searchQuery)}` : '';
        fetch(`${API_BASE_URL}/files/list?page=${page}&size=${pageSize}${queryParam}`)
            .then(response => response.json())
            .then(data => {
                console.log('Backend returned:', data);
                setFiles(data.content || []);
                setTotalPages(data.totalPages || 1);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching files:', error);
                setLoading(false);
            });
    }, [page, pageSize, searchQuery]);

    //sorting logic
    const sortedFiles = [...files].sort((a, b) => {
        const aValue = a[sortField]?.toString().toLowerCase() || '';
        const bValue = b[sortField]?.toString().toLowerCase() || '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });


    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    // For Download functionality
    const handleDownload = async (fileName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/files/download?fileName=${fileName}`, {
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

    return (
        <div style={{ padding: '20px' }}>
            <h2>Uploaded Files</h2>
            <>
                <div className="uploaded-files-container">

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        flexWrap: 'wrap'
                    }}>
                        {/* Left: Page size selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <label htmlFor="pageSizeSelect">Show:</label>
                            <select
                                id="pageSizeSelect"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(parseInt(e.target.value));
                                    setPage(0);
                                }}
                            >
                                <option value={2}>2</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                            <span>items per page</span>
                        </div>

                        {/* Right: Search bar */}
                        <input
                            type="text"
                            placeholder="Search by title, course, tags, instructor, etc."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '70%',
                                padding: '10px',
                                marginBottom: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <table className="files-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                                    Title {sortField === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('fileName')} style={{ cursor: 'pointer' }}>
                                    File name {sortField === 'fileName' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('courseName')} style={{ cursor: 'pointer' }}>
                                    Course {sortField === 'courseName' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('instructor')} style={{ cursor: 'pointer' }}>
                                    Instructor {sortField === 'instructor' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('semester')} style={{ cursor: 'pointer' }}>
                                    Semester {sortField === 'semester' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                                    Department {sortField === 'department' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('tags')} style={{ cursor: 'pointer' }}>
                                    Tags {sortField === 'tags' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('uploadedAt')} style={{ cursor: 'pointer' }}>
                                    Uploaded At {sortField === 'uploadedAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>Loading files...</td>
                                </tr>
                            ) : sortedFiles.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>No files uploaded yet.</td>
                                </tr>
                            ) : (
                                sortedFiles.map(file => (
                                    <tr key={file.id}>
                                        <td>
                                            <Link to={`/file/${file.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                                             {file.title}
                                             </Link>
                                         </td>
                                        <td>{file.fileName}</td>
                                        <td>{file.courseCode} - {file.courseName}</td>
                                        <td>{file.instructor}</td>
                                        <td>{file.semester}</td>
                                        <td>{file.department}</td>
                                        <td>
                                            {file.tags.split(',').map(tag => (
                                                <span key={tag} className="tag">{tag.trim()}</span>
                                            ))}
                                        </td>

                                        <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDownload(file.fileName)}
                                                style={{
                                                    color: 'blue',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                                title="Download"
                                            >
                                                <FiDownload size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <button onClick={() => setPage(page - 1)} disabled={page === 0}>&laquo; Prev</button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>Next &raquo;</button>
                </div>
            </>

        </div>
    );
}

export default UploadedFilesList;