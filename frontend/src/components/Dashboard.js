import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import apiService from '../services/api';

const Dashboard = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiService.get('/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAvis(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (avisList) => {
    if (avisList.length === 0) {
      setStats({ total: 0, moyenne: 0 });
      return;
    }

    const totals = avisList.reduce((acc, avis) => {
      acc.qualite_service += avis.qualite_service;
      acc.accueil_personnel += avis.accueil_personnel;
      acc.rapidite += avis.rapidite;
      acc.rapport_qualite_prix += avis.rapport_qualite_prix;
      acc.satisfaction_globale += avis.satisfaction_globale;
      return acc;
    }, {
      qualite_service: 0,
      accueil_personnel: 0,
      rapidite: 0,
      rapport_qualite_prix: 0,
      satisfaction_globale: 0
    });

    const count = avisList.length;
    const moyenne = (
      totals.qualite_service +
      totals.accueil_personnel +
      totals.rapidite +
      totals.rapport_qualite_prix +
      totals.satisfaction_globale
    ) / (count * 5);

    setStats({
      total: count,
      moyenne: moyenne.toFixed(1),
      qualite_service: (totals.qualite_service / count).toFixed(1),
      accueil_personnel: (totals.accueil_personnel / count).toFixed(1),
      rapidite: (totals.rapidite / count).toFixed(1),
      rapport_qualite_prix: (totals.rapport_qualite_prix / count).toFixed(1),
      satisfaction_globale: (totals.satisfaction_globale / count).toFixed(1)
    });
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="dashboard-loading">Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tableau de Bord - Avis Clients</h1>
        <p>Gérez et analysez les retours de vos clients</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Avis</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Note Moyenne</h3>
          <div className="stat-number">{stats.moyenne}/5</div>
        </div>
        <div className="stat-card">
          <h3>Qualité Service</h3>
          <div className="stat-number">{stats.qualite_service}/5</div>
        </div>
        <div className="stat-card">
          <h3>Satisfaction</h3>
          <div className="stat-number">{stats.satisfaction_globale}/5</div>
        </div>
      </div>

      <div className="avis-list">
        <h2>Derniers Avis ({avis.length})</h2>
        {avis.length === 0 ? (
          <div className="no-avis">Aucun avis pour le moment</div>
        ) : (
          avis.map((item) => (
            <div key={item.id} className="avis-card">
              <div className="avis-header">
                <span className="avis-date">
                  {new Date(item.date_creation).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="avis-ratings">
                <div className="rating-row">
                  <span>⭐ Qualité du service:</span>
                  <span>{renderStars(item.qualite_service)} ({item.qualite_service}/5)</span>
                </div>
                <div className="rating-row">
                  <span>🙋 Accueil du personnel:</span>
                  <span>{renderStars(item.accueil_personnel)} ({item.accueil_personnel}/5)</span>
                </div>
                <div className="rating-row">
                  <span>⚡ Rapidité:</span>
                  <span>{renderStars(item.rapidite)} ({item.rapidite}/5)</span>
                </div>
                <div className="rating-row">
                  <span>💰 Rapport qualité/prix:</span>
                  <span>{renderStars(item.rapport_qualite_prix)} ({item.rapport_qualite_prix}/5)</span>
                </div>
                <div className="rating-row">
                  <span>😊 Satisfaction globale:</span>
                  <span>{renderStars(item.satisfaction_globale)} ({item.satisfaction_globale}/5)</span>
                </div>
              </div>

              {item.suggestions && (
                <div className="avis-suggestions">
                  <h4>Suggestions:</h4>
                  <p>{item.suggestions}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;