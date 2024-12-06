import "./App.css";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Products from "./pages/Products/Products";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import SellerHomePage from "./pages/Seller/SellerHomePage/SellerHomePage";
import Orders from "./pages/Orders/Orders";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import Search from "./pages/Search/Search";
import CatePage from "./pages/CatePage/CatePage";
import TopSeller from "./pages/TopSeller/TopSeller";
import AdminHomePage from "./pages/Admin/AdminHomePage/AdminHomePage";
import Help from "./pages/Help/Help";
import ChangePassWord from "./pages/Auth/ChangePassWord";
import VerifyAccount from "./pages/Auth/VerifyAccount";
import ForgotPassWord from "./pages/Auth/ForgotPassWord";

function App() {
  if ("AmbientLightSensor" in window) {
    try {
      const sensor = new AmbientLightSensor();

      sensor.addEventListener("reading", () => {
        console.log(`Ambient light level: ${sensor.illuminance} lux`);
        if (sensor.illuminance < 50) {
          document.body.style.backgroundColor = "black";
          document.body.style.color = "white";
        } else {
          document.body.style.backgroundColor = "white";
          document.body.style.color = "black";
        }
      });

      sensor.addEventListener("error", (event) => {
        console.error("Sensor error:", event.error.name, event.error.message);
      });

      sensor.start();
    } catch (error) {
      console.error("Ambient Light Sensor not supported:", error);
    }
  } else {
    console.log("Ambient Light Sensor API is not supported by your browser.");
  }
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/changepass" element={<ChangePassWord />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassWord />} />
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/seller/" element={<SellerHomePage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/signup/verify-otp" element={<VerifyOtp />} />
        <Route path="/search-results" element={<Search />} />
        <Route path="/cate-page" element={<CatePage />} />
        <Route path="/product-seller-page" element={<TopSeller />} />
        <Route path="/admin" element={<AdminHomePage />} />
      </Routes>
    </div>
  );
}

export default App;
