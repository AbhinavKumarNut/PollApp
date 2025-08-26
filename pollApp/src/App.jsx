import { BrowserRouter as Router, Routes, Route, Link, useNavigate, NavLink, Navigate } from "react-router-dom";
import RegisterForm from "./pages/RegisterUser.jsx";
import LoginForm from "./pages/LoginUser.jsx";
import { StartScreen } from "./pages/StartScreen.jsx";
import { Layout } from "./components/layout.jsx";
import { HomeScreen } from "./pages/HomeScreen.jsx";
import { useState } from "react";
import { CreateScreen } from "./pages/CreateScreen.jsx";
import { VoteScreen } from "./pages/VoteScreen.jsx";
import { MyPolls } from "./pages/MyPolls.jsx";

const SecurityCheck = ({isLoggedIn, childFun}) => {
  if(!isLoggedIn){
    return <Navigate to="/login"/>;
  }
  return childFun
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const loginSuccess = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(null);
  };


  return (
    <Router>
      <div>
        <Routes>
          <Route element={<Layout isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout}/>}>
            <Route path="/" element={<StartScreen />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm loginSuccess={loginSuccess} username={username}/>} />

            <Route path="/home" element={<SecurityCheck isLoggedIn={isLoggedIn} childFun={<HomeScreen username={username} />} />}/>
            <Route path="/create" element={<SecurityCheck isLoggedIn={isLoggedIn} childFun={<CreateScreen username={username}/>}/>} />
            <Route path="/vote" element={<SecurityCheck isLoggedIn={isLoggedIn} childFun = {<VoteScreen />} />}/>
            <Route path="/mypolls" element={<SecurityCheck isLoggedIn={isLoggedIn} childFun = {<MyPolls username={username}/>}/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App;

