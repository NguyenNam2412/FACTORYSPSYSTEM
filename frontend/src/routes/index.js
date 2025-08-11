import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/Home/HomePage";
import NotFound from "../pages/Home/NotFound";
import AdminSide from "../pages/Admin/AdminSide";

//home side
import ListFileMealMenus from "../pages/mealMenus/ListFileMealMenus";

const AppRouter = () => (
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* home side */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/meal-menus" element={<ListFileMealMenus />} />
      {/* home side */}
      <Route path="/admin-side" element={<AdminSide />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRouter;
