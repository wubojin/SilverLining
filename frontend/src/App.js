import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import RequestTutor from "./pages/RequestTutor";
import BrowseTutees from "./pages/BrowseTutees";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Logo from "./images/Logo.jpg";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();
  const [authState, setAuthState] = useState(() => {
    const savedAuthState = localStorage.getItem("authState");
    return savedAuthState
      ? JSON.parse(savedAuthState)
      : {
          username: "",
          id: 0,
          status: false,
        };
  });

  useEffect(() => {
    axios
      .get("https://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState((prevAuthState) => ({
            ...prevAuthState,
            status: false,
          }));
        } else {
          const newAuthState = {
            username: response.data.username,
            id: response.data.id,
            status: true,
          };
          setAuthState(newAuthState);
          localStorage.setItem("authState", JSON.stringify(newAuthState));
        }
      });
  }, []);

  useEffect(() => {
    setCurrentPath(location.pathname);
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [location, authState]);

  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authState");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    navigate("/");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div className="navbar">
          <div className="logo-container">
            <img src={Logo} className="logo" alt="logo" />
            <h2 className="logo-text">SilverLining</h2>
            {authState.status && (
              <h3 className="welcome-text">
                Hello,{" "}
                <Link to={`/profile/${authState.id}`} className="username-link">
                  {authState.username}
                </Link>
                !
              </h3>
            )}
          </div>
          <div className="links">
            <Link to="/" className={currentPath === "/" ? "active" : ""}>
              Home
            </Link>
            {!authState.status ? (
              <>
                <Link
                  to="/login"
                  className={currentPath === "/login" ? "active" : ""}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className={currentPath === "/signup" ? "active" : ""}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/requesttutor"
                  className={currentPath === "/requesttutor" ? "active" : ""}
                >
                  Request for a Tutor
                </Link>
                <Link
                  to="/browsetutees"
                  className={currentPath === "/browsetutees" ? "active" : ""}
                >
                  Browse for Tutees
                </Link>
                <button onClick={logout}>Log out</button>
              </>
            )}
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requesttutor" element={<RequestTutor />} />
          <Route path="/browsetutees" element={<BrowseTutees />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
