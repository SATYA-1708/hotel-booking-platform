import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import useAppContext from "./hooks/useAppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import SavedHotels from "./pages/SavedHotels";
import Home from "./pages/Home";
import ApiDocs from "./pages/ApiDocs";
import ApiStatus from "./pages/ApiStatus";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import AuthCallback from "./pages/AuthCallback";
import BookingConfirmation from "./pages/BookingConfirmation";
import Profile from "./pages/Profile";
import HotelReviews from "./pages/HotelReviews";
import Destinations from "./pages/Destinations";
import Offers from "./pages/Offers";
import HelpCenter from "./pages/HelpCenter";
import OwnerHotelAnalytics from "./pages/OwnerHotelAnalytics";
import AdminRoute from "./components/AdminRoute";
import RoleRoute from "./components/RoleRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminActivity from "./pages/admin/AdminActivity";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/hotel/:hotelId/reviews"
          element={
            <Layout>
              <HotelReviews />
            </Layout>
          }
        />
        <Route
          path="/destinations"
          element={
            <Layout>
              <Destinations />
            </Layout>
          }
        />
        <Route
          path="/offers"
          element={
            <Layout>
              <Offers />
            </Layout>
          }
        />
        <Route
          path="/help"
          element={
            <Layout>
              <HelpCenter />
            </Layout>
          }
        />
        <Route
          path="/api-docs"
          element={
            <Layout>
              <ApiDocs />
            </Layout>
          }
        />
        <Route
          path="/api-status"
          element={
            <Layout>
              <ApiStatus />
            </Layout>
          }
        />
        <Route
          path="/business-insights"
          element={
            <RoleRoute allow={["admin"]}>
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <Layout>
              <AuthCallback />
            </Layout>
          }
        />

        <Route
          path="/my-hotels"
          element={
            <RoleRoute allow={["admin", "hotel_owner"]}>
              <Layout>
                <MyHotels />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <RoleRoute>
              <Layout>
                <MyBookings />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/saved-hotels"
          element={
            <RoleRoute>
              <Layout>
                <SavedHotels />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleRoute>
              <Layout>
                <Profile />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/booking-success"
          element={
            <RoleRoute>
              <Layout>
                <BookingConfirmation />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/my-hotels/:hotelId/analytics"
          element={
            <RoleRoute allow={["admin", "hotel_owner"]}>
              <Layout>
                <OwnerHotelAnalytics />
              </Layout>
            </RoleRoute>
          }
        />

        {/* Hotel-domain admin shell — role gate via /users/me */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="activity" element={<AdminActivity />} />
        </Route>

        {isLoggedIn && (
          <Route
            path="/hotel/:hotelId/booking"
            element={
              <Layout>
                <Booking />
              </Layout>
            }
          />
        )}

        <Route
          path="/add-hotel"
          element={
            <RoleRoute allow={["admin", "hotel_owner"]}>
              <Layout>
                <AddHotel />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/edit-hotel/:hotelId"
          element={
            <RoleRoute allow={["admin", "hotel_owner"]}>
              <Layout>
                <EditHotel />
              </Layout>
            </RoleRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
