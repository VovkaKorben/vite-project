import MainPage from './pages/MainPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RegisterConfirm from './pages/RegisterConfirm.jsx';
import TopMenu from './common/TopMenu.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/common.css';

function App() {
  return (
    <BrowserRouter>

      <TopMenu />

      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm/:link?" element={<RegisterConfirm />} />
      </Routes>


    </BrowserRouter>

  );
}

export default App;
