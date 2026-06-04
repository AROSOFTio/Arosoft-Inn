import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Systems from "@/pages/Systems";
import Scripts from "@/pages/Scripts";
import Academy from "@/pages/Academy";
import CourseDetail from "@/pages/CourseDetail";
import Portfolio from "@/pages/Portfolio";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import SupportDashboard from "@/pages/dashboards/SupportDashboard";
import ClientDashboard from "@/pages/dashboards/ClientDashboard";
import StudentDashboard from "@/pages/dashboards/StudentDashboard";
import DeveloperDashboard from "@/pages/dashboards/DeveloperDashboard";
import MarketingDashboard from "@/pages/dashboards/MarketingDashboard";
import VideoDashboard from "@/pages/dashboards/VideoDashboard";
import FinanceDashboard from "@/pages/dashboards/FinanceDashboard";
import ComplianceDashboard from "@/pages/dashboards/ComplianceDashboard";
import SupportInbox from "@/pages/support/SupportInbox";
import SupportMessageDetail from "@/pages/support/SupportMessageDetail";
import ClientRequests from "@/pages/client/ClientRequests";
import ClientProjects from "@/pages/client/ClientProjects";
import AdminRequests from "@/pages/admin/AdminRequests";
import AdminRequestDetail from "@/pages/admin/AdminRequestDetail";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminTasks from "@/pages/admin/AdminTasks";
import AdminSystems from "@/pages/admin/AdminSystems";
import AdminScripts from "@/pages/admin/AdminScripts";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminStudentProgress from "@/pages/admin/AdminStudentProgress";
import AdminComingSoon from "@/pages/admin/AdminComingSoon";
import StaffTasks from "@/pages/staff/StaffTasks";
import TaskDetail from "@/pages/tasks/TaskDetail";
import StudentLearning from "@/pages/student/StudentLearning";
import StudentCourseLearn from "@/pages/student/StudentCourseLearn";
import StudentQuizzes from "@/pages/student/StudentQuizzes";
import TakeQuiz from "@/pages/student/TakeQuiz";
import StudentAssignments from "@/pages/student/StudentAssignments";
import StudentProgress from "@/pages/student/StudentProgress";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/systems" component={Systems} />
      <Route path="/scripts" component={Scripts} />
      <Route path="/academy/:slug" component={CourseDetail} />
      <Route path="/academy" component={Academy} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/login" component={Login} />
      <Route path="/admin/requests/:id" component={AdminRequestDetail} />
      <Route path="/admin/requests" component={AdminRequests} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/tasks" component={AdminTasks} />
      <Route path="/admin/systems" component={AdminSystems} />
      <Route path="/admin/scripts" component={AdminScripts} />
      <Route path="/admin/courses" component={AdminCourses} />
      <Route path="/admin/progress" component={AdminStudentProgress} />
      <Route path="/admin/team" component={AdminComingSoon} />
      <Route path="/admin/portfolio" component={AdminComingSoon} />
      <Route path="/admin/invoices" component={AdminComingSoon} />
      <Route path="/admin/compliance" component={AdminComingSoon} />
      <Route path="/admin/settings" component={AdminComingSoon} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/support/messages/:id" component={SupportMessageDetail} />
      <Route path="/support/messages" component={SupportInbox} />
      <Route path="/support/tasks" component={StaffTasks} />
      <Route path="/support" component={SupportDashboard} />
      <Route path="/client/requests" component={ClientRequests} />
      <Route path="/client/projects" component={ClientProjects} />
      <Route path="/client" component={ClientDashboard} />
      <Route path="/student/courses/:id/learn" component={StudentCourseLearn} />
      <Route path="/student/learning" component={StudentLearning} />
      <Route path="/student/quizzes/:id" component={TakeQuiz} />
      <Route path="/student/quizzes" component={StudentQuizzes} />
      <Route path="/student/assignments" component={StudentAssignments} />
      <Route path="/student/progress" component={StudentProgress} />
      <Route path="/student" component={StudentDashboard} />
      <Route path="/developer/tasks" component={StaffTasks} />
      <Route path="/developer" component={DeveloperDashboard} />
      <Route path="/marketing/tasks" component={StaffTasks} />
      <Route path="/marketing" component={MarketingDashboard} />
      <Route path="/video/tasks" component={StaffTasks} />
      <Route path="/video" component={VideoDashboard} />
      <Route path="/finance/tasks" component={StaffTasks} />
      <Route path="/finance" component={FinanceDashboard} />
      <Route path="/compliance/tasks" component={StaffTasks} />
      <Route path="/compliance" component={ComplianceDashboard} />
      <Route path="/staff/tasks" component={StaffTasks} />
      <Route path="/tasks/:id" component={TaskDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
