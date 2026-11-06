import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import { AppStateProvider } from "./providers/AppStateProvider";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";
import { DashboardPage } from "../pages/dashboard";
import { ProjectsPage } from "../pages/projects";
import { EditorPage } from "../pages/editor";
import { AnalysisPage } from "../pages/analysis";
import { SettingsPage } from "../pages/settings";
import { AppShell } from "../widgets/app-shell";

export default function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="editor/:projectId" element={<EditorPage />} />
            <Route path="analysis/:projectId" element={<AnalysisPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppStateProvider>
  );
}
