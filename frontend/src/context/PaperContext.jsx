
import { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const PaperContext = createContext(null);

export const PaperProvider = ({ children }) => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load papers when user authenticates
    const loadPapers = async () => {
      if (!user) {
        setPapers([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const storedPapers = await api.getPapers();
        setPapers(storedPapers);
      } catch (err) {
        console.error("Failed to load papers", err);
      } finally {
        setLoading(false);
      }
    };
    loadPapers();
  }, [user]);

  const submitPaper = async (paperData) => {
    const newPaper = {
      ...paperData,
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      comments: []
    };
    try {
      const response = await api.submitPaper(newPaper);
      setPapers(prev => [...prev, response.paper]);
      return { success: true };
    } catch (error) {
       return { success: false, message: error.message || 'Submission failed' };
    }
  };

  const updatePaper = async (paper) => {
    try {
      await api.updatePaper(paper);
      setPapers(prev => prev.map(p => p.id === paper.id ? paper : p));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Update failed' };
    }
  };

  const deletePaper = async (id) => {
    try {
        // We probably need an api.deletePaper method
        // But for now, let's assume api.updatePaper can't delete. 
        // Wait, I need to check api.js if it has deletePaper.
        // I'll assume I need to add it to api.js first or use what I have.
        // Checking api.js... it has deleteUser but not deletePaper.
        // I will add deletePaper to api.js in a separate step or just use fetch here? 
        // Better to use api.js. I'll add it to api.js first? 
        // No, I'll add it here assuming api.deletePaper exists and then update api.js
        await api.deletePaper(id);
        setPapers(prev => prev.filter(p => p.id !== id));
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Delete failed' };
    }
  };

  const updatePaperStatus = async (paperId, status, rejectionReason = null) => {
    try {
      const response = await api.updatePaperStatus(paperId, status, null, rejectionReason);
      setPapers(prev => prev.map(p => p.id === paperId ? response.paper : p));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Update status failed' };
    }
  };

  const addComment = async (paperId, commentText) => {
    const paper = papers.find(p => p.id === paperId);
    if (!paper) {
      return { success: false, message: 'Paper not found' };
    }
    
    try {
      // The new /comments endpoint accepts comments from authors, reviewers, and admins
      const response = await api.addCommentToPaper(paperId, commentText);
      setPapers(prev => prev.map(p => p.id === paperId ? response.paper : p));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Comment failed' };
    }
  };

  return (
    <PaperContext.Provider value={{ papers, submitPaper, updatePaperStatus, updatePaper, deletePaper, addComment, loading }}>
        {!loading && children}
    </PaperContext.Provider>
  );
};

export const usePapers = () => useContext(PaperContext);
