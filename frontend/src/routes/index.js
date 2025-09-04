import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@pages/Login/LoginPage";
import HomePage from "@pages/Home/HomePage";
import NotFound from "@pages/Home/NotFound";
import AdminSide from "@pages/Admin/AdminSide";

//home side
import ListFileMealMenus from "@pages/mealMenus/ListFileMealMenus";
import MealMenus from "@pages/mealMenus/MealMenus";
import ListAllMealReg from "@pages/mealMenus/ListAllMealReg";

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
      >
        {/* default Route redirect to meal-menus */}
        <Route index element={<Navigate to="meal-menus/all" replace />} />

        {/* real route meal-menus */}
        <Route path="meal-menus/all" element={<MealMenus />} />
        <Route
          path="meal-menus/list-files-meal-menus"
          element={<ListFileMealMenus />}
        />
        <Route path="meal-menus/list-meal-reg" element={<ListAllMealReg />} />

        {/* other route */}
        {/* <Route path="other" element={<OtherPage />} /> */}
      </Route>
      {/* home side */}
      <Route path="/admin-side" element={<AdminSide />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

export default AppRouter;
