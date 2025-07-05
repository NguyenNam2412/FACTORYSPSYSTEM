import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/Home/HomePage";
import NotFound from "../pages/Home/NotFound";
import AdminSide from "../pages/Admin/AdminSide";

const AppRouter = () => (
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<AdminSide />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRouter;
