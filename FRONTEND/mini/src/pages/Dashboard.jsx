import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileDown, ChevronRight, Folder, FolderOpen, BookText } from 'lucide-react';

function Dashboard() {
  const { backendUrl, user, setUser } = useContext(AuthContext);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [papersRes, userRes] = await Promise.all([
        axios.get(`${backendUrl}/papers/all`),
        axios.get(`${backendUrl}/papers/me`)
      ]);
      setPapers(papersRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, setUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleProgress = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/papers/toggle-progress/${id}`);
      setUser({ ...user, completedPapers: res.data.updatedProgress });
    } catch (error) {
      console.error('Error toggling progress:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

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

  const getExpectedSemesters = (year) => {
    if (year === "1st Year") return ["Sem 1", "Sem 2"];
    if (year === "2nd Year") return ["Sem 3", "Sem 4"];
    if (year === "3rd Year") return ["Sem 5", "Sem 6"];
    if (year === "4th Year") return ["Sem 7", "Sem 8"];
    return [];
  };

  const availableBranches = [...new Set([
    ...MOCK_BRANCHES,
    ...papers.map(p => p.branch || 'Computer Science')
  ])].sort();

  const availableYears = selectedBranch 
    ? [...new Set([
        "1st Year", "2nd Year", "3rd Year", "4th Year",
        ...papers.filter(p => (p.branch || 'Computer Science') === selectedBranch).map(p => p.academicYear || '1st Year')
      ])].sort()
    : [];

  const availableSemesters = selectedYear 
    ? [...new Set([
        ...getExpectedSemesters(selectedYear),
        ...papers.filter(p => (p.academicYear || '1st Year') === selectedYear && (p.branch || 'Computer Science') === selectedBranch).map(p => p.semester || 'Sem 1')
      ])].sort()
    : [];
    
  const availableSubjects = selectedSemester
    ? [...new Set([
        ...(MOCK_SUBJECTS[selectedSemester] || []),
        ...papers.filter(p => (p.academicYear || '1st Year') === selectedYear && (p.branch || 'Computer Science') === selectedBranch && (p.semester || 'Sem 1') === selectedSemester).map(p => p.subject)
      ])].sort()
    : [];

  const visiblePapers = selectedSubject
    ? papers.filter(p => (p.academicYear || '1st Year') === selectedYear && (p.branch || 'Computer Science') === selectedBranch && (p.semester || 'Sem 1') === selectedSemester && p.subject === selectedSubject)
    : [];

  return (
    <div>
      <h1>Your PYQ Portal</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Track your progress and access all previous year questions step-by-step.
      </p>

      <div className="slide-container">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-nav">
            <div 
              className={`breadcrumb-item ${!selectedBranch ? 'active' : ''}`} 
              onClick={() => { setSelectedBranch(null); setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
            >
              Branches
            </div>
            
            {selectedBranch && (
              <>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <div 
                  className={`breadcrumb-item ${selectedBranch && !selectedYear ? 'active' : ''}`} 
                  onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
                >
                  {selectedBranch}
                </div>
              </>
            )}

            {selectedYear && (
              <>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <div 
                  className={`breadcrumb-item ${selectedYear && !selectedSemester ? 'active' : ''}`} 
                  onClick={() => { setSelectedSemester(null); setSelectedSubject(null); }}
                >
                  {selectedYear}
                </div>
              </>
            )}

            {selectedSemester && (
              <>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <div 
                  className={`breadcrumb-item ${selectedSemester && !selectedSubject ? 'active' : ''}`} 
                  onClick={() => { setSelectedSubject(null); }}
                >
                  {selectedSemester}
                </div>
              </>
            )}

            {selectedSubject && (
              <>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <div className={`breadcrumb-item active`}>
                  {selectedSubject}
                </div>
              </>
            )}
          </div>

          <div className="slide-content" key={`${selectedBranch}-${selectedYear}-${selectedSemester}-${selectedSubject}`}>
            
            {/* Step 1: Select Branch */}
            {!selectedBranch && (
              <div className="grid-cols-2">
                {availableBranches.map(branch => (
                  <div key={branch} className="glass-panel wizard-card" onClick={() => setSelectedBranch(branch)}>
                    <FolderOpen size={24} style={{ marginRight: '10px', color: 'var(--accent-primary)' }} />
                    {branch}
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Select Year */}
            {selectedBranch && !selectedYear && (
              <div className="grid-cols-2">
                {availableYears.map(year => (
                  <div key={year} className="glass-panel wizard-card" onClick={() => setSelectedYear(year)}>
                    <Folder size={24} style={{ marginRight: '10px', color: 'var(--accent-primary)' }} />
                    {year}
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Select Semester */}
            {selectedYear && !selectedSemester && (
              <div className="grid-cols-2">
                {availableSemesters.map(sem => (
                  <div key={sem} className="glass-panel wizard-card" onClick={() => setSelectedSemester(sem)}>
                    <FolderOpen size={24} style={{ marginRight: '10px', color: 'var(--accent-primary)' }} />
                    {sem}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Select Subject */}
            {selectedSemester && !selectedSubject && (
              <div className="grid-cols-2">
                {availableSubjects.map(sub => (
                  <div key={sub} className="glass-panel wizard-card" onClick={() => setSelectedSubject(sub)}>
                    <BookText size={24} style={{ marginRight: '10px', color: 'var(--accent-secondary)' }} />
                    {sub}
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Display Papers */}
            {selectedSubject && (
              <div className="grid-cols-2">
                {visiblePapers.length === 0 ? (
                  <p>No papers uploaded yet for {selectedSubject}.</p>
                ) : (
                  visiblePapers.map(paper => {
                    const isCompleted = user?.completedPapers?.includes(paper._id);
                    return (
                      <div key={paper._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div className={isCompleted ? 'completed-text' : ''}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{paper.title}</h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Year: {paper.year}</span>
                          </div>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox" 
                            checked={isCompleted || false}
                            onChange={() => handleToggleProgress(paper._id)}
                            title="Mark as completed"
                          />
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                          <a 
                            href={`${backendUrl.replace('/api', '')}/${paper.fileUrl.replace(/\\/g, '/')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="btn-primary" 
                            style={{ textDecoration: 'none', flex: 1 }}
                          >
                            <FileDown size={18} /> View / Download
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default Dashboard;
