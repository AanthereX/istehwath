import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SCREENS } from "./routes.constants";

function PrivateRoute({ role }) {
  const userRole = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (userRole === role) {
    return <Outlet />;
  } else if (user && JSON.parse(user)) {
    return (
      <Navigate
        to={
          userRole === "buyer"
            ? SCREENS.buyerMarketplace
            : userRole === "seller"
            ? SCREENS.sellerListing
            : SCREENS.role
        }
        state={{ from: location }}
        replace
      />
    );
  } else {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }
}

export default PrivateRoute;
