/* eslint-disable no-unused-vars */
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/getCookie";

const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const AuthRoute =
  ({ requireAuth = false, redirectIfAuth = false, allowedRoles = [] } = {}) =>
  (WrappedComponent) => {
    const WithAuth = (props) => {
      const location = useLocation();
      const token = getCookie("authToken");
      const user = getCookie("authUser");

      if (redirectIfAuth && !isTokenExpired(token)) {
        const from = location.state?.from?.pathname || "/dashboard";
        return <Navigate to={from} replace />;
      }

      if (requireAuth && (isTokenExpired(token) || !user)) {
        document.cookie = "authToken=; path=/; max-age=0";
        document.cookie = "authUser=; path=/; max-age=0";
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      if (allowedRoles.length > 0) {
        if (
          isTokenExpired(token) ||
          !user ||
          !allowedRoles.includes(user.role)
        ) {
          document.cookie = "authToken=; path=/; max-age=0";
          document.cookie = "authUser=; path=/; max-age=0";
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
      }

      return <WrappedComponent {...props} />;
    };

    return WithAuth;
  };

export default AuthRoute;
