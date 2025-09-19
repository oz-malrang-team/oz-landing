import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import RouletteDonation from "./pages/RouletteDonation";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import Company from "./pages/Company";
import ProfileEdit from "./pages/ProfileEdit";
import ChangePassword from "./pages/ChangePassword";
import Receipts from "./pages/Receipts";
import BottomNavigation from "./components/BottomNavigation";

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App min-h-screen flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<RouletteDonation />} />
              <Route path="/home" element={<Home />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/profile-edit" element={<ProfileEdit />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/donation-history" element={<MyPage />} />
              <Route path="/privacy-policy" element={<Settings />} />
              <Route path="/terms" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/roulette" element={<RouletteDonation />} />
              <Route path="/company" element={<Company />} />
            </Routes>
          </div>
          <BottomNavigation />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
