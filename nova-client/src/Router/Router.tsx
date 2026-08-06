import AuthWrapper from "@/pages/AuthWrapper";
import OAuthCallback from "@/pages/OAuthCallback";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPwd";
import AddTask from "@/pages/AddTask";
import { Assistant } from "@/pages/Assistant";
import { CalendarPage } from "@/pages/Calendar";
import Documents from "@/pages/Documents";
import Finance from "@/pages/Finance";
import Goals from "@/pages/Goals";
import Notes from "@/pages/Notes";
import Today from "@/pages/Today";
import { Auth } from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Travel from "@/pages/Travel";
import TravelPlanner from "@/pages/TravelPlanner";
import RequestDemoPage from "@/pages/RequestDemoPage";
import LandingPage from "@/pages/LandingPage";
import LiveWalkthroughPage from "@/pages/LiveWalkthrough";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/explore" element={<RequestDemoPage />} />
       


        


        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<LandingPage />} />
                   <Route path="/request-demo" element={<LiveWalkthroughPage />} />

          



        </Route>

        <Route element={<ProtectedRoute />} >

                <Route path="/today" element={<Today />} />
                <Route path="/add-task" element={<AddTask />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/travel" element={<Travel />} />
                                <Route path="/travel-planner" element={<TravelPlanner />} />




        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
