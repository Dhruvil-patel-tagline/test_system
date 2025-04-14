import "./navbar.css";

const Footer = () => {
  return (
    <div className="footer">
      &copy; copyright {new Date().getFullYear()}{" "}
      <span style={{ color: "rgb(18, 219, 206)" }}>Tagline Test System</span>{" "}
      all right are reserved
    </div>
  );
};

export default Footer;
