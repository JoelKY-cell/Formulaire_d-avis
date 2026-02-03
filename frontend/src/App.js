import React, { useState, useEffect } from 'react';
import './App.css';
import AvisForm from './components/AvisForm';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Login from './components/Login';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userToken, username, role) => {
    setToken(userToken);
    setIsAuthenticated(true);
    setCurrentView(role === 'superadmin' ? 'users' : 'dashboard');
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken(null);
    setIsAuthenticated(false);
    setCurrentView('form');
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      const role = localStorage.getItem('role');
      setCurrentView(role === 'superadmin' ? 'users' : 'dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const getDashboardLabel = () => {
    const role = localStorage.getItem('role');
    return role === 'superadmin' ? '🔧 Gestion Utilisateurs' : '📊 Tableau de Bord';
  };

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-brand">
          <span className="nav-brand-icon">⭐</span>
          <span>Avis Clients</span>
        </div>
        
        <div className="nav-links">
          <button 
            className={currentView === 'form' ? 'active' : ''}
            onClick={() => setCurrentView('form')}
          >
            📝 Formulaire d'Avis
          </button>
          <button 
            className={currentView === 'dashboard' || currentView === 'login' || currentView === 'users' ? 'active' : ''}
            onClick={handleDashboardClick}
          >
            {getDashboardLabel()}
          </button>
        </div>
        
        <div className="nav-actions">
          {isAuthenticated && (
            <>
              <span className="user-info">
                {localStorage.getItem('role') === 'superadmin' ? '🔑' : '👤'} 
                {localStorage.getItem('username') || 'Utilisateur'}
                {localStorage.getItem('role') === 'superadmin' && <small> (SuperAdmin)</small>}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Déconnexion
              </button>
            </>
          )}
        </div>
      </nav>
      
      {currentView === 'form' && <AvisForm />}
      {currentView === 'login' && <Login onLogin={handleLogin} />}
      {currentView === 'dashboard' && isAuthenticated && <Dashboard token={token} />}
      {currentView === 'users' && isAuthenticated && <UserManagement />}
    </div>
  );
}

export default App;
