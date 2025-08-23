import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && allowedRoles?.includes(userInfo.role)) {
    return <Outlet />;
  } else if (userInfo) {
    // Si l'utilisateur est connecté mais n'a pas le bon rôle, on le renvoie à sa page d'accueil
    return <Navigate to="/home" replace />;
  } else {
    // Si personne n'est connecté, on le renvoie à la page d'accueil publique
    return <Navigate to="/landing" replace />;
  }
};

export default ProtectedRoute;