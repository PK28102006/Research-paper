import { useState, useEffect } from 'react';
import { api } from '../../services/api'; 
import { Search, Edit, Trash2, X } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  
  // Edit User State
  const [editingUser, setEditingUser] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await api.getUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Failed to load users", error);
      setUsers([]);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.deleteUser(userId);
        loadUsers(); 
      } catch (error) {
        console.error("Failed to delete user", error);
        alert('Failed to delete user');
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (editingUser) {
      try {
        await api.updateUser(editingUser);
        loadUsers();
        setIsEditModalOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error("Failed to update user", error);
        alert('Failed to update user');
      }
    }
  };

  // Filter Users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="dashboard-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Manage Users</h2>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '250px' }}
                />
            </div>
        </div>
        
        <div className="users-list-section" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem' }}>{user.name}</td>
                        <td style={{ padding: '0.75rem' }}>{user.email}</td>
                        <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>
                            <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '999px', 
                            fontSize: '0.85rem',
                            backgroundColor: user.role === 'admin' ? '#f3e8ff' : user.role === 'reviewer' ? '#ecfdf5' : '#eff6ff',
                            color: user.role === 'admin' ? '#7e22ce' : user.role === 'reviewer' ? '#047857' : '#1d4ed8'
                            }}>
                            {user.role}
                            </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <button 
                            onClick={() => openEditModal(user)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', marginRight: '0.5rem' }}
                            title="Edit User"
                            >
                            <Edit size={18} />
                            </button>
                            {/* Optional: Add Delete Button if needed */}
                             <button 
                                onClick={() => handleDelete(user.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                title="Delete User"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                            No users found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>

        {/* Edit User Modal */}
        {isEditModalOpen && (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', position: 'relative' }}>
            <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
                <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Edit User</h3>
            
                <form onSubmit={handleUpdateUser}>
                <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={editingUser?.name || ''} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                    required
                />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={editingUser?.email || ''} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                    required
                />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Role</label>
                <select 
                    name="role" 
                    value={editingUser?.role || 'student'} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: 'white' }}
                >
                    <option value="student">Student</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', cursor: 'pointer' }}>Save Changes</button>
                </div>
            </form>
            </div>
        </div>
        )}
    </div>
  );
};

export default ManageUsers;
