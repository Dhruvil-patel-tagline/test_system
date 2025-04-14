import classNames from "classnames";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import exam from "../../assets/exam.png";
import logout from "../../assets/logout.svg";
import menu from "../../assets/menu.svg";
import userIcon from "../../assets/user.png";
import ButtonCom from "../../shared/ButtonCom";
import { getCookie } from "../../utils/getCookie";
import { studentNavObj, teacherNavObj } from "../../utils/staticObj";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const location = useLocation();
  const user = getCookie("authUser");
  let navObj = user?.role === "teacher" ? teacherNavObj : studentNavObj;

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "authUser=; path=/; max-age=0";
    toast.success("Logout Successfully");
    navigate("/login");
  };

  const navClass = classNames("mobile", { mobileView: openNav });

  return (
    <div>
      <div className="navbar">
        <div className="logoDiv">
          <div className="logoAndMenu">
            <div className="logo">
              <img
                src={exam}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
                alt="ExamCite"
                height="40px"
                width="40px"
              />
            </div>
            <div className="menuDiv">
              <img
                src={menu}
                alt="Menu"
                className="menuBtn"
                onClick={() => setOpenNav(!openNav)}
              />
            </div>
          </div>
          <nav className={navClass}>
            <div className="innerNav">
              {navObj &&
                navObj.map((val, index) => (
                  <NavLink
                    key={index}
                    className={({ isActive }) =>
                      isActive ? "active" : "navAnchor"
                    }
                    to={val.to}
                  >
                    {val.text}
                  </NavLink>
                ))}
            </div>
          </nav>
        </div>
        <div className={navClass}>
          <p
            style={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <img src={userIcon} width="25px" height="25px" />
            {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}(
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)})
          </p>
          <ButtonCom
            onClick={handleLogout}
            disabled={location.pathname === "/examForm"}
          >
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <img
                src={logout}
                width="15px"
                height="15px"
                style={{ color: "yellow" }}
              />
              Logout
            </span>
          </ButtonCom>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
