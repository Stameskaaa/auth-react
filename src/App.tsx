import './App.css';
import { AuthComponent } from './components/auth/Auth';
import '@mantine/core/styles.css';
import { RegistrationComponent } from './components/registrate/Registration';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/home/Home';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthComponent />} />
        <Route path="/registration" element={<RegistrationComponent />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
