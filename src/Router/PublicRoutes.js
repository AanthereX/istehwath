import { Navigate, useLocation } from "react-router-dom";

const PublicRoutes = ({ children, redirectLink }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  if (user && userRole) {
    return <Navigate to={redirectLink} state={{ from: location }} />;
  }
  return children;
};

export default PublicRoutes;
