import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AboutQBiT from "./pages/AboutQBiT";
import ContactUs from "./pages/ContactUs";
import JaundiceGuide from "./pages/jaundice";
import BilliQuantMission from "./pages/mission";
import TestEntry from "./pages/TestEntry";  
import "./App.css";
import PatientAnalytics from "./pages/PatientAnalytics";
import ChildProfile from "./pages/ChildProfile";
import LogIn from "./pages/LogIn";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />

      <Route path="/home" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about_qbit" element={<AboutQBiT />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="jaundice" element={<JaundiceGuide />} />
        <Route path="mission" element={<BilliQuantMission />} />
        <Route path="patient_analytics" element={<PatientAnalytics />} />
        <Route path="profile" element={<ChildProfile/>} />
      </Route>
    </Routes>
  );
}

export default App;
