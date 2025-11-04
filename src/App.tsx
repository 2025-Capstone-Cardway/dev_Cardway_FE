// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import CardPage from './pages/CardPage';
import MyPage from './pages/MyPage';

function App() {
  return (
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cardpage" element={<CardPage/>} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
