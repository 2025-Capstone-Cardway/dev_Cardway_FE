// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CardPage from "./pages/CardPage";
import MyPage from "./pages/MyPage";
import Layout from "./components/common/Layout";
import LoginPage from "./pages/LoginPage";
import AuthCallback from "./pages/AuthCallback";
import CardRegisterPage from "./pages/CardRegisterPage";
import CardRegisterInfoPage from "./pages/CardRegisterInfoPage";
import CardDetailPage from "./pages/CardDetailPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthInitializer from "./components/auth/AuthInitializer";

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/callback/*" element={<AuthCallback />} />
        
        {/* 로그인 이후 보호된 라우트 ( 로그인 필요함) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cardpage" element={<CardPage />} />
            <Route path="/card/:cardId" element={<CardDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/card/register" element={<CardRegisterPage />} />
            <Route
              path="/card/register/info"
              element={<CardRegisterInfoPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
