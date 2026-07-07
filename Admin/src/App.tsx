import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import CustomerPortal from "./pages/CustomerPortal";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { OrdersProvider } from "./pages/Orders/OrdersContext";
import NewOrder from "./pages/Orders/NewOrder";
import Products from "./pages/Orders/Products";
import CustomerOrders from "./pages/Orders/CustomerOrders";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Default route - signin ga yo'naltiradi */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        
        {/* Customer Portal - Public route (hamma ko'ra oladi) */}
        <Route path="/shop" element={
          <OrdersProvider>
            <CustomerPortal />
          </OrdersProvider>
        } />
        
        {/* Auth Pages - Public (token bor bo'lsa dashboard ga yo'naltiradi) */}
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } 
        />
        
        {/* User Dashboard - Redirect to shop */}
        <Route 
          path="/user-dashboard" 
          element={<Navigate to="/shop" replace />}
        />
        
        {/* Admin Dashboard Layout - Protected, Admin Only */}
        <Route element={
          <ProtectedRoute adminOnly>
            <OrdersProvider>
              <AppLayout />
            </OrdersProvider>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Home />} />
          
          {/* Orders Section */}
          <Route path="/orders">
            <Route path="new" element={<NewOrder />} />
            <Route path="list" element={<CustomerOrders />} />
            <Route path="view/:id" element={<NewOrder />} />
            <Route path="products" element={<Products />} />
          </Route>

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LoadingProvider>
  );
}
