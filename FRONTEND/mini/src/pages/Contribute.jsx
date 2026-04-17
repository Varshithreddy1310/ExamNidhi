import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Upload, CheckCircle } from 'lucide-react';

function Contribute() {
  const { backendUrl, user } = useContext(AuthContext);
  
  // Pre-fill user data
  const contributorName = user?.username || '';
  const scholarNumber = user?.email || user?.phone || '';

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [branch, setBranch] = useState('Computer Science');
  const [semester, setSemester] = useState('Sem 1');
  const [file, setFile] = useState(null);
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Reset trailing dropdowns gracefully on parent change
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

  // Set first subject on semester change
  useEffect(() => {
    const subjects = MOCK_SUBJECTS[semester] || [];
    if (subjects.length > 0) {
      setSubject(subjects[0]);
    } else {
      setSubject('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setLoading(true);

    const formData = new FormData();
    formData.append('contributorName', contributorName);
    formData.append('scholarNumber', scholarNumber);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('year', year);
    formData.append('academicYear', academicYear);
    formData.append('branch', branch);
    formData.append('semester', semester);
    formData.append('pdf', file);

    try {
      await axios.post(`${backendUrl}/papers/student-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTitle(''); setYear(''); setFile(null);
      // Optional: don't reset name and contact because they are read-only
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upload Question Paper</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Contribute to the PYQ portal by uploading your previous year questions. Submissions will be reviewed by an administrator.
      </p>
      
      {success && (
        <div className="glass-panel" style={{ textAlign: 'center', borderColor: 'var(--success-color)', marginBottom: '2rem' }}>
          <CheckCircle size={48} color="var(--success-color)" style={{ marginBottom: '1rem' }} />
          <h3>Your paper has been submitted successfully.</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>It is now pending admin approval.</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>
            Submit Another Paper
          </button>
        </div>
      )}

      {!success && (
        <div className="glass-panel">
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Student Name</label>
              <input className="input-glass" type="text" value={contributorName} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label>Email / Phone</label>
              <input className="input-glass" type="text" value={scholarNumber} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

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
              <label>Paper Year</label>
              <input className="input-glass" type="number" value={year} onChange={e => setYear(e.target.value)} required placeholder="2025" />
            </div>
            <div className="form-group">
              <label>PDF File</label>
              <input className="input-glass" type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files[0])} required style={{ border: 'none', padding: '10px 0' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              <Upload size={18} /> {loading ? 'Uploading...' : 'Submit Question Paper'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Contribute;
