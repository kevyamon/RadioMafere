import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Le vigile vérifie trois choses :
  // 1. Est-ce que quelqu'un est connecté (userInfo existe) ?
  // 2. Est-ce que la liste des rôles autorisés est bien définie ?
  // 3. Est-ce que le rôle de l'utilisateur connecté fait partie des rôles autorisés ?
  
  if (userInfo && allowedRoles?.includes(userInfo.role)) {
    // Si tout est bon, on affiche la page demandée (grâce à <Outlet />)
    return <Outlet />;
  } else if (userInfo) {
    // Si l'utilisateur est connecté mais n'a pas le bon rôle, on le renvoie vers une page "accès refusé"
    // Pour l'instant, on le renvoie à l'accueil
    return <Navigate to="/" replace />;
  } else {
    // Si personne n'est connecté, on le renvoie à la page de connexion
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;