import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GradeIcon from "@mui/icons-material/Grade";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { extendTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import ManageStudents from "./ManageStudents";
import CreateAssignment from "./CreateAssignment";
import ViewSubmissions from "./ViewSubmissions";
import GradeAssignments from "./GradeAssignments";
import ViewResults from "./ViewResults";

const NAVIGATION = [
  { kind: "header", title: "Admin Panel" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "manage-students", title: "Manage Students", icon: <GroupIcon /> },
  { segment: "create-assignment", title: "Create Assignment", icon: <AssignmentIcon /> },
  { segment: "view-submissions", title: "View Submissions", icon: <VisibilityIcon /> },
  { segment: "grade-assignments", title: "Grade Assignments", icon: <GradeIcon /> },
  { segment: "view-results", title: "View Results", icon: <BarChartIcon /> },
  { kind: "divider" }, // Separates logout from other items
  { segment: "logout", title: "Logout", icon: <ExitToAppIcon />, action: "" },
];

const theme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
});

function useToolpadRouter() {
  const savedPath = localStorage.getItem("admin_dashboard_path") || "/dashboard";
  const [pathname, setPathname] = React.useState(savedPath);

  React.useEffect(() => {
    localStorage.setItem("admin_dashboard_path", pathname);
  }, [pathname]);

  return React.useMemo(() => ({
    pathname,
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);
}

export default function AdminDashboard() {
  const router = useToolpadRouter();

  const renderContent = () => {
    switch (router.pathname) {
      case "/manage-students":
        return <ManageStudents />;
      case "/create-assignment":
        return <CreateAssignment />;
      case "/view-submissions":
        return <ViewSubmissions />;
      case "/grade-assignments":
        return <GradeAssignments />;
      case "/view-results":
        return <ViewResults />;
      case "/logout":
        handleLogout();
        return null;
      default:
        return <h2>Welcome to the Admin Dashboard</h2>;
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("admin_dashboard_path");
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