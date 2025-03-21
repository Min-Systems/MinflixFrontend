import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import ProfilePickerPage from './ProfilePickerPage';
import ProfileHomePage from './ProfileHomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profiles" element={<ProfilePickerPage />} />
        <Route path="/profile/:profileId" element={<ProfileHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;