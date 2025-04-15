import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import ProtectedLayout from "./components/Layout/ProtectedLayout"; // ← Import this
import Postjob from "./employer/PostJobForm"
import AllJobs from "./User/AllJobs"
import JobResults from "./User/JobResults";
import SearchResults from "./User/SearchResults";
import JobApplyForm from "./User/JobApplyForm";
import JobSeekerProfile from "./User/MyApplications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-jobs/" element={<AllJobs />} />
        <Route path="/jobs/:keyword" element={<JobResults />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/myapplications" element={<JobSeekerProfile />} />


        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Home />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <JobApplyForm />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <EmployerDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/dashboard/Post-job"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Postjob />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
