import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Upload } from 'lucide-react';

function AdminPanel() {
  const { backendUrl } = useContext(AuthContext);
  const [papers, setPapers] = useState([]);
  const [pendingPapers, setPendingPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [branch, setBranch] = useState('Computer Science');
  const [semester, setSemester] = useState('Sem 1');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);

  // Cascading Logic Constants
  const MOCK_BRANCHES = [
    "Computer Science",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Mathematics and Data Science"
  ];

  const MOCK_SUBJECTS = {
    "Sem 1": ["Mathematics I", "Physics", "Electrical Engineering", "Engineering Graphics", "Data Structures"],
    "Sem 2": ["Mathematics II", "Chemistry", "C Programming", "English Communication"],
    "Sem 3": ["Data Structures", "Digital Logic", "Object Oriented Programming", "Discrete Mathematics"],
    "Sem 4": ["Fundamental of Entrepreneurship", "Software Engineering", "Computer System Organization", "Theory of Computation", "Data Communication", "Algorithm Design and Analysis"],
    "Sem 5": ["Computer Networks", "Software Engineering", "Theory of Computation", "Web Technologies"],
    "Sem 6": ["Artificial Intelligence", "Compiler Design", "Machine Learning", "Information Security"],
    "Sem 7": ["Cloud Computing", "Internet of Things", "Big Data Analytics", "Data Mining"],
    "Sem 8": ["Blockchain Technology", "Deep Learning", "Cyber Security", "Project Work"]
  };

  const getExpectedSemesters = (y) => {
    if (y === "1st Year") return ["Sem 1", "Sem 2"];
    if (y === "2nd Year") return ["Sem 3", "Sem 4"];
    if (y === "3rd Year") return ["Sem 5", "Sem 6"];
    if (y === "4th Year") return ["Sem 7", "Sem 8"];
    return [];
  };

  const availableSemesters = getExpectedSemesters(academicYear);
  const availableSubjects = MOCK_SUBJECTS[semester] || [];

  const handleYearChange = (e) => {
    const val = e.target.value;
    setAcademicYear(val);
    const sems = getExpectedSemesters(val);
    if (sems.length > 0) {
      setSemester(sems[0]);
      setSubject(MOCK_SUBJECTS[sems[0]]?.[0] || '');
    }
  };

  const handleSemChange = (e) => {
    const val = e.target.value;
    setSemester(val);
    setSubject(MOCK_SUBJECTS[val]?.[0] || '');
  };

  useEffect(() => {
    if (!subject) {
      const subjects = MOCK_SUBJECTS[semester] || [];
      if (subjects.length > 0) {
        setSubject(subjects[0]);
      }
    }
    // Only run when component mounts or semester changes initially if subject is empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester]);

  const fetchPapers = useCallback(async () => {
    try {
      const [papersRes, pendingRes] = await Promise.all([
        axios.get(`${backendUrl}/papers/all`),
        axios.get(`${backendUrl}/papers/pending`)
      ]);
      setPapers(papersRes.data);
      setPendingPapers(pendingRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('year', year);
    formData.append('academicYear', academicYear);
    formData.append('branch', branch);
    formData.append('semester', semester);
    formData.append('pdf', file);

    try {
      await axios.post(`${backendUrl}/papers/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Upload successful');
      setTitle(''); setSubject(''); setYear(''); setFile(null);
      setAcademicYear('1st Year'); setBranch('Computer Science'); setSemester('Sem 1');
      fetchPapers(); // Refresh
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
  };

  const handleDelete = async (id, isPending = false) => {
    if (!window.confirm("Are you sure you want to permanently delete this paper?")) return;
    try {
      await axios.delete(`${backendUrl}/papers/delete/${id}`);
      if (isPending) {
        setPendingPapers(pendingPapers.filter(p => p._id !== id));
      } else {
        setPapers(papers.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Delete error', error);
      alert('Failed to delete paper');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${backendUrl}/papers/verify/${id}`);
      alert('Paper approved successfully!');
      fetchPapers(); // refresh lists
    } catch (error) {
      console.error('Approve error', error);
      alert('Failed to approve paper');
    }
  };

  return (
    <div>
      <h1>Admin Control Panel</h1>
      
      <div className="glass-panel" style={{ marginBottom: '3rem', maxWidth: '600px' }}>
        <h2>Upload New PYQ</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Paper Title</label>
            <input className="input-glass" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Midterm Fall 2025" />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Branch</label>
              <select className="input-glass" value={branch} onChange={e => setBranch(e.target.value)} required>
                {MOCK_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Academic Year</label>
              <select className="input-glass" value={academicYear} onChange={handleYearChange} required>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Semester</label>
              <select className="input-glass" value={semester} onChange={handleSemChange} required>
                {availableSemesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label>Subject</label>
              <select className="input-glass" value={subject} onChange={e => setSubject(e.target.value)} required>
                {availableSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Year</label>
            <input className="input-glass" type="number" value={year} onChange={e => setYear(e.target.value)} required placeholder="2025" />
          </div>
          <div className="form-group">
            <label>PDF File</label>
            <input className="input-glass" type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} required style={{ border: 'none', padding: '10px 0' }} />
          </div>
          <button type="submit" className="btn-primary">
            <Upload size={18} /> Upload Document
          </button>
        </form>
      </div>

      <h2>Manage Existing Papers</h2>
      <div className="grid-cols-auto">
        {papers.map(paper => (
          <div key={paper._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h3>{paper.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{paper.academicYear} | {paper.branch || 'Computer Science'} | {paper.semester} | {paper.subject} | {paper.year}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <a 
                href={paper.fileUrl.startsWith('http') 
                    ? paper.fileUrl 
                    : `${backendUrl.replace('/api', '')}/${paper.fileUrl.replace(/\\/g, '/')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                download={`${paper.title}.pdf`}
                className="btn-primary" 
                style={{ textDecoration: 'none' }}
              >
                View / Download
              </a>
              <button onClick={() => handleDelete(paper._id, false)} className="btn-primary btn-danger" style={{ alignSelf: 'flex-start' }}>
                <Trash2 size={18} /> Delete Paper
              </button>
            </div>
          </div>
        ))}
        {papers.length === 0 && !loading && <p>No papers uploaded yet.</p>}
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2>Pending Student Contributions</h2>
        <div className="grid-cols-auto">
          {pendingPapers.map(paper => (
            <div key={paper._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-primary)' }}>
              <div>
                <h3 style={{ color: 'var(--accent-primary)' }}>{paper.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{paper.academicYear} | {paper.branch || 'Computer Science'} | {paper.semester} | {paper.subject} | {paper.year}</p>
                {paper.contributorName && (
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    <strong>Submitted by:</strong> {paper.contributorName} {paper.scholarNumber ? `(${paper.scholarNumber})` : ''}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <a 
                  href={paper.fileUrl.startsWith('http') 
                      ? paper.fileUrl 
                      : `${backendUrl.replace('/api', '')}/${paper.fileUrl.replace(/\\/g, '/')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={`${paper.title}.pdf`}
                  className="btn-primary" 
                  style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)' }}
                >
                  View PDF
                </a>
                <button onClick={() => handleApprove(paper._id)} className="btn-primary" style={{ background: 'var(--success-color)' }}>
                  Approve
                </button>
                <button onClick={() => handleDelete(paper._id, true)} className="btn-primary btn-danger" style={{ alignSelf: 'flex-start' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {pendingPapers.length === 0 && !loading && <p>No pending papers to review.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
