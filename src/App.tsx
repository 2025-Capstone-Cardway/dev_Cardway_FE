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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cardpage" element={<CardPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/callback/*" element={<AuthCallback />} />
          <Route path="/card/register" element={<CardRegisterPage />} />
          <Route
            path="/card/register/info"
            element={<CardRegisterInfoPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
