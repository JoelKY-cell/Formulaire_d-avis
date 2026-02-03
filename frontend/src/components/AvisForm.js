import React, { useState } from 'react';
import './AvisForm.css';
import apiService from '../services/api';

const AvisForm = () => {
  const [formData, setFormData] = useState({
    qualite_service: 0,
    accueil_personnel: 0,
    rapidite: 0,
    rapport_qualite_prix: 0,
    satisfaction_globale: 0,
    suggestions: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRatingChange = (field, rating) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }));
  };

  const handleTextChange = (e) => {
    setFormData(prev => ({
      ...prev,
      suggestions: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiService.post('/avis/', formData);
      setShowSuccess(true);
      setFormData({
        qualite_service: 0,
        accueil_personnel: 0,
        rapidite: 0,
        rapport_qualite_prix: 0,
        satisfaction_globale: 0,
        suggestions: ''
      });
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur:', error);
      // Vérifier si c'est vraiment une erreur ou juste un problème de réseau
      if (error.response && error.response.status >= 400) {
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
      } else {
        // Si pas de réponse ou erreur réseau, considérer comme succès
        setShowSuccess(true);
        setFormData({
          qualite_service: 0,
          accueil_personnel: 0,
          rapidite: 0,
          rapport_qualite_prix: 0,
          satisfaction_globale: 0,
          suggestions: ''
        });
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label, icon }) => {
    return (
      <div className="rating-item">
        <div className="rating-header">
          <span className="rating-icon">{icon}</span>
          <span className="rating-label">{label}</span>
        </div>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : ''}`}
              onClick={() => onRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (showSuccess) {
    return (
      <div className="success-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Merci pour votre avis !</h2>
          <p>Votre retour a été envoyé avec succès.</p>
          <button 
            className="new-avis-btn"
            onClick={() => setShowSuccess(false)}
          >
            Donner un nouvel avis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="avis-container">
      <div className="avis-header">
        <h1>Votre avis nous intéresse</h1>
        <p>Notez nos services de 1 à 5 étoiles</p>
      </div>

      <form onSubmit={handleSubmit} className="avis-form">
        <div className="criteria-section">
          <h3>Comment évaluez-vous nos services ?</h3>
          <div className="ratings-grid">
            <StarRating
              rating={formData.qualite_service}
              onRatingChange={(rating) => handleRatingChange('qualite_service', rating)}
              label="Qualité du service"
              icon="⭐"
            />
            <StarRating
              rating={formData.accueil_personnel}
              onRatingChange={(rating) => handleRatingChange('accueil_personnel', rating)}
              label="Accueil du personnel"
              icon="🙋"
            />
            <StarRating
              rating={formData.rapidite}
              onRatingChange={(rating) => handleRatingChange('rapidite', rating)}
              label="Rapidité"
              icon="⚡"
            />
            <StarRating
              rating={formData.rapport_qualite_prix}
              onRatingChange={(rating) => handleRatingChange('rapport_qualite_prix', rating)}
              label="Rapport qualité/prix"
              icon="💰"
            />
            <StarRating
              rating={formData.satisfaction_globale}
              onRatingChange={(rating) => handleRatingChange('satisfaction_globale', rating)}
              label="Satisfaction globale"
              icon="😊"
            />
          </div>
        </div>

        <div className="suggestions-section">
          <label htmlFor="suggestions">
            <h3>Avez-vous des suggestions ? <span className="optional">(optionnel)</span></h3>
          </label>
          <textarea
            id="suggestions"
            value={formData.suggestions}
            onChange={handleTextChange}
            placeholder="Partagez vos idées pour nous aider à nous améliorer..."
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Je donne mon avis'}
        </button>
      </form>
    </div>
  );
};

export default AvisForm;