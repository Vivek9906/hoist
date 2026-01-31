import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import HostSetup from './pages/HostSetup';
import JoinSetup from './pages/JoinSetup';
import PartyRoom from './pages/PartyRoom';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={<HostSetup />} />
        <Route path="/join" element={<JoinSetup />} />
        <Route path="/party/:partyId" element={<PartyRoom />} />
        {/* Redirect others to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
