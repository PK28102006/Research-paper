
const STORAGE_KEYS = {
  USERS: 'journal_users',
  PAPERS: 'journal_papers',
  CURRENT_USER: 'journal_current_user',
};

export const storageService = {
  // Generic Get
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage`, error);
      return null;
    }
  },

  // Generic Set
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} to storage`, error);
    }
  },

  // Users
  getUsers: () => storageService.get(STORAGE_KEYS.USERS) || [],
  saveUser: (user) => {
    const users = storageService.getUsers();
    users.push(user);
    storageService.set(STORAGE_KEYS.USERS, users);
  },
  updateUser: (updatedUser) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storageService.set(STORAGE_KEYS.USERS, users);
    }
  },
  deleteUser: (userId) => {
    let users = storageService.getUsers();
    users = users.filter(u => u.id !== userId);
    storageService.set(STORAGE_KEYS.USERS, users);
  },
  
  // Papers
  getPapers: () => storageService.get(STORAGE_KEYS.PAPERS) || [],
  savePaper: (paper) => {
    const papers = storageService.getPapers();
    papers.push(paper);
    storageService.set(STORAGE_KEYS.PAPERS, papers);
  },
  updatePaper: (updatedPaper) => {
    const papers = storageService.getPapers();
    const index = papers.findIndex(p => p.id === updatedPaper.id);
    if (index !== -1) {
      papers[index] = updatedPaper;
      storageService.set(STORAGE_KEYS.PAPERS, papers);
    }
  },

  // Session
  getCurrentUser: () => storageService.get(STORAGE_KEYS.CURRENT_USER),
  setCurrentUser: (user) => storageService.set(STORAGE_KEYS.CURRENT_USER, user),
  clearSession: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),

  // Initialize with some dummy data if empty (Optional, for demo)
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const admin = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@journal.com',
        role: 'admin',
        password: 'admin' // Simple password for demo
      };
      storageService.set(STORAGE_KEYS.USERS, [admin]);
    }
  }
};
