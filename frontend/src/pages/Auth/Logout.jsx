import React, { useContext, useEffect } from 'react';
import { logout } from '../../apis/Auth';
import { TokenContext } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { setToken, setRole } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Appel API de déconnexion côté serveur si nécessaire
        await logout();
      } catch (err) {
        console.error('Erreur lors de la déconnexion', err);
      } finally {
        // Toujours nettoyer localStorage et contexte
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        if (typeof setToken === 'function') setToken(null);
        if (typeof setRole === 'function') setRole(null);
        navigate('/login');
      }
    };

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      Déconnexion en cours...
    </div>
  );
};

export default Logout;