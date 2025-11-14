import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { TokenContext } from '../Contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(TokenContext);

 
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;