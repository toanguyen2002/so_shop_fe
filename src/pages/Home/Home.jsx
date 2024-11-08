import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import SliderSection from "../../components/Sections/SliderSection";
import BannerSection from "../../components/Sections/BannerSection";
import CategorySection from "../../components/Sections/CategorySection";
import ProductSection from "../../components/Sections/ProductSection";
import FooterSection from "../../components/Sections/FooterSection";
import { useLocation } from "react-router-dom";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { useEffect } from "react";
import Notification from "../../components/Notification/Notification";
import {
  getClassifiesByProductId,
  getProductMainPage,
} from "../../api/productAPI";
import Loading from "../../components/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../actions/cateAction";
import { selectAllCategories } from "../../features/cateSlice";
import TopSellerSection from "../../components/Sections/TopSellerSection";

const Home = () => {
  const [products, setProducts] = useState([]);
  const locate = useLocation();
  const successMessage = locate.state ? locate.state.successMessage : "";
  const [showNotification, setShowNotification] = useState(!!successMessage);

  // get all products
  useEffect(() => {
    const fetchProductMainPage = async () => {
      try {
        const { data } = await getProductMainPage();
        const productWithClassifies = await Promise.all(
          data.map(async (product) => {
            const classifiesResponse = await getClassifiesByProductId(
              product._id
            );
            return { ...product, classifies: classifiesResponse.data };
          })
        );
        setProducts(productWithClassifies);
        console.log("Products Homepage: ", productWithClassifies);
      } catch (error) {
        console.log("Error fetching products: ", error);
      }
    };
    fetchProductMainPage();
  }, []);

  // get all categories
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {showNotification && (
        <Notification
          message={successMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="homepage-content">
        <div className="bg-color-1">
          <div className="slider-banner-section">
            <section className="slider">
              <SliderSection />
            </section>
            <section className="banner">
              <BannerSection />
            </section>
          </div>
        </div>

        <section className="brand">
          <TopSellerSection />
        </section>

        <section className="category">
          <CategorySection />
        </section>

        <section className="products">
          <ProductSection isHomepage={true} products={products} />
        </section>

        <section className="footer">
          <FooterSection />
        </section>
      </div>
    </div>
  );
};

export default Home;
