import MainPage from './pages/MainPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserInfo from './pages/UserInfo.jsx';
import RegisterConfirm from './pages/RegisterConfirm.jsx';
import RegisterDone from './pages/RegisterDone.jsx';
import TopMenu from './common/TopMenu.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


import './css/common.css';
import './css/flex.css';

function App() {
  return (
    <BrowserRouter>

      <TopMenu />

      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerdone" element={<RegisterDone />} />
        <Route path="/confirm/:link?" element={<RegisterConfirm />} />
        <Route path="/user/:user_id" element={<UserInfo />} />
        
      </Routes>


    </BrowserRouter>

  );
}

export default App;
