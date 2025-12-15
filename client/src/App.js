import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layout/Layout.js";
import { Signup } from "./pages/signup/Signup.js";
import { OAuthSuccess } from "./pages/oAuthSuccess/OAuthSuccess.js";
import { ProtectedRoutes } from "./routes/ProtectedRoutes.js";
import { PublicRoutes } from "./routes/PublicRoutes.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Layout />
            </PublicRoutes>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoutes>
              <Signup />
            </PublicRoutes>
          }
        />

        {/* Protected pages */}
        <Route
          path="/oauth-success"
          element={
            <ProtectedRoutes>
              <OAuthSuccess />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;