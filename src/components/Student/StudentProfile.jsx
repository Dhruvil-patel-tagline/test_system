import { NavLink, Outlet } from "react-router-dom";
import { links } from "../../utils/staticObj";
import "./css/studentNav.css";
import AuthRoute from "../auth/AuthRoute";

const StudentProfile = () => {
  return (
    <div className="stuContainer">
      <nav className="StudentNavbar">
        {links.map((val) => (
          <NavLink
            style={{ padding: "25px" }}
            className={({ isActive }) => (isActive ? "StuActive" : " ")}
            to={val.url}
            key={val.name}
          >
            {val.name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default AuthRoute({ requireAuth: true, allowedRoles: ['student'] })(StudentProfile);

// export default StudentProfile;
