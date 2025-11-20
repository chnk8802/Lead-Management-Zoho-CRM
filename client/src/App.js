import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout.js";
import { Signup } from "./pages/signup/Signup.js";
import { OAuthSuccess } from "./pages/oAuthSuccess/OAuthSuccess.js";
import { LeadsPage } from "./pages/leads/LeadsPage.js";
import { LeadMappingPage } from "./pages/leadMapping/LeadMappingPage.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/lead-mapping" element={<LeadMappingPage />} />
        <Route path="" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
