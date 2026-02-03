import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import apiService from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiService.get('/users/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await apiService.post('/users/', newUser, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNewUser({ username: '', email: '', password: '', is_staff: false });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la creation');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await apiService.put(`/users/${editingUser.id}/`, editingUser, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la modification');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cet utilisateur ?')) {
      try {
        const token = localStorage.getItem('token');
        await apiService.delete(`/users/${userId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="user-management">
      <div className="header">
        <h1>Gestion des Utilisateurs</h1>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Ajouter un utilisateur
        </button>
      </div>

      {editingUser && (
        <div className="add-form">
          <h3>Modifier l'utilisateur</h3>
          <form onSubmit={handleEditUser}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={editingUser.username}
              onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe (optionnel)"
              value={editingUser.password || ''}
              onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
            />
            <label>
              <input
                type="checkbox"
                checked={editingUser.is_staff}
                onChange={(e) => setEditingUser({...editingUser, is_staff: e.target.checked})}
              />
              Administrateur
            </label>
            <div className="form-actions">
              <button type="submit">Modifier</button>
              <button type="button" onClick={() => setEditingUser(null)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="add-form">
          <h3>Nouvel utilisateur</h3>
          <form onSubmit={handleAddUser}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={newUser.is_staff}
                onChange={(e) => setNewUser({...newUser, is_staff: e.target.checked})}
              />
              Administrateur
            </label>
            <div className="form-actions">
              <button type="submit">Creer</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        <h2>Utilisateurs du systeme ({users.length})</h2>
        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-header">
                  <span className="user-icon">
                    {user.is_superuser ? '🔑' : user.is_staff ? '👤' : '👥'}
                  </span>
                  <div>
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="user-badges">
                  {user.is_superuser && <span className="badge super">SuperAdmin</span>}
                  {user.is_staff && !user.is_superuser && <span className="badge admin">Admin</span>}
                  {!user.is_staff && <span className="badge user">Utilisateur</span>}
                </div>
                <div className="user-date">
                  Cree le {new Date(user.date_joined).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="user-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setEditingUser({...user, password: ''})}
                >
                  Modifier
                </button>
                {!user.is_superuser && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;