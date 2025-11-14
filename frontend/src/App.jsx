import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Pages Paiements
import Checkout from "./pages/Paiements/Checkout";
import PaiementPage from "./pages/Paiements/PaiementPage";
import PaymentCancel from "./pages/Paiements/PaiementCancel";
import PaiementHistory from "./pages/Paiements/PaiementHistory";

// Pages principales
import Home from "./pages/Home/Home";
import Notfound from "./components/Notfound";

// Pages Cours
import CoursesList from "./pages/Courses/CoursesList";
import CourseDetail from "./pages/Courses/CourseDetail";
import CreateCourse from "./pages/Courses/CreateCourse";
import EditCourse from "./pages/Courses/EditCourse";
import MyCourses from "./pages/Courses/Mycourses";

// Pages Quiz
import TakeQuiz from "./pages/Quiz/TakeQuiz";
import CreateQuiz from "./pages/Quiz/CreateQuiz";

// Pages Utilisateurs
import UpdateProfile from "./pages/Users/UpdateProfile";
import UserList from "./pages/Users/UserList";

// Pages Progression et Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";
import UserProgress from "./pages/Progressions/UserProgress";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques avec Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Route>

        {/* Routes de paiement publiques (succès/annulation) */}
        <Route path="/payment/success" element={<PaiementPage />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Routes utilisateur connecté (student + instructor + admin) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UpdateProfile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-progress" element={<UserProgress />} />
          
          {/* Routes de paiement protégées */}
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/paiements" element={<PaiementHistory />} />
          
          <Route path="/quiz/course/:id" element={<TakeQuiz />} />
        </Route>

        {/* Routes prof et admin uniquement */}
        <Route
          path="/"
          element={
            <RoleBasedRoute allowedRoles={["prof", "admin"]}>
              <Layout />
            </RoleBasedRoute>
          }
        >
          <Route path="/courses/new" element={<CreateCourse />} />
          <Route path="/courses/:id/edit" element={<EditCourse />} />
          <Route path="/quiz/create" element={<CreateQuiz />} />
        </Route>

        {/* Routes admin uniquement */}
        <Route
          path="/"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Layout />
            </RoleBasedRoute>
          }
        >
          <Route path="/users" element={<UserList />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;