import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Logo from "./images/Logo.jpg";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequestTutor from "./pages/RequestTutor";
import BrowseTutees from "./pages/BrowseTutees";
import StudyGroups from "./pages/StudyGroups";
import StudyGroupForm from "./pages/StudyGroupForm";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import TutorRequests from "./helpers/TutorRequests";
import TuitionApplications from "./helpers/TuitionApplications";
import FormedStudyGroups from "./helpers/FormedStudyGroups";
import JoinedStudyGroups from "./helpers/JoinedStudyGroups";
import ApplyTuition from "./pages/ApplyTuition";
import Applications from "./pages/Applications";
import PageNotFound from "./pages/PageNotFound";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPath, setCurrentPath] = useState("");
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

  const handleLogoutFromChangePassword = () => {
    logout();
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div className="navbar">
          <div className="logo-container">
            <Link to="/">
              <img src={Logo} className="logo" alt="logo" />
            </Link>

            {authState.status && (
              <h3 className="welcome-text">
                Hello,{" "}
                <Link to={`/profile/${authState.id}`} className="username-link">
                  {authState.username}
                </Link>{" "}
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
                {authState.status && (
                  <>
                    <Link
                      to="/requesttutor"
                      className={
                        currentPath === "/requesttutor" ? "active" : ""
                      }
                    >
                      Request for a Tutor
                    </Link>

                    <Link
                      to="/browsetutees"
                      className={
                        currentPath === "/browsetutees" ? "active" : ""
                      }
                    >
                      Browse for Tutees
                    </Link>

                    <Link
                      to="/studygroups"
                      className={currentPath === "/studygroups" ? "active" : ""}
                    >
                      Study Groups
                    </Link>
                  </>
                )}

                <button onClick={logout}>Log out</button>
              </>
            )}
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/requesttutor" element={<RequestTutor />} />
          <Route path="/browsetutees" element={<BrowseTutees />} />
          <Route path="/studygroups" element={<StudyGroups />} />
          <Route path="/studygroupform" element={<StudyGroupForm />} />
          <Route path="/profile/:id" element={<Profile />}>
            <Route
              path="/profile/:id/tutor-requests"
              element={<TutorRequests />}
            />
            <Route
              path="/profile/:id/tuition-applications"
              element={<TuitionApplications />}
            />
            <Route
              path="/profile/:id/formed-study-groups"
              element={<FormedStudyGroups />}
            />
            <Route
              path="/profile/:id/joined-study-groups"
              element={<JoinedStudyGroups />}
            />
          </Route>
          <Route
            path="/changepassword"
            element={
              <ChangePassword onLogout={handleLogoutFromChangePassword} />
            }
          />
          <Route path="/applytuition" element={<ApplyTuition />} />
          <Route path="/applications/:id" element={<Applications />} />
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
