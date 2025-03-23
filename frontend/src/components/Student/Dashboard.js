import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { extendTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import Profile from "./Profile";
import Assignments from "./Assignments";
import Submissions from "./Submissions";
import Results from "./Results";
import Notifications from "./Notifications";

const NAVIGATION = [
  { kind: "header", title: "Main" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "profile", title: "Profile", icon: <PersonIcon /> },
  { segment: "assignments", title: "Assignments", icon: <AssignmentIcon /> },
  { segment: "submissions", title: "Submissions", icon: <UploadFileIcon /> },
  { segment: "results", title: "Results", icon: <BarChartIcon /> },
  { segment: "notifications", title: "Notifications", icon: <NotificationsIcon /> },
  { kind: "divider" }, // Separates logout from other items
  { segment: "logout", title: "Logout", icon: <ExitToAppIcon />, action: "" }, // Logout button
];

const theme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
});

function useToolpadRouter() {
  const savedPath = localStorage.getItem("student_dashboard_path") || "/dashboard";
  const [pathname, setPathname] = React.useState(savedPath);

  React.useEffect(() => {
    localStorage.setItem("student_dashboard_path", pathname);
  }, [pathname]);

  return React.useMemo(() => ({
    pathname,
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);
}

export default function StudentDashboard() {
  const router = useToolpadRouter();

  const renderContent = () => {
    switch (router.pathname) {
      case "/profile":
        return <Profile />;
      case "/assignments":
        return <Assignments />;
      case "/submissions":
        return <Submissions />;
      case "/results":
        return <Results />;
      case "/notifications":
        return <Notifications />;
      case "/logout":
        handleLogout();
        return null;
      default:
        return <h2>Welcome to the Student Dashboard</h2>;
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("student_dashboard_path");
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={theme}>
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={2}>
            <Grid xs={12}>{renderContent()}</Grid>
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}