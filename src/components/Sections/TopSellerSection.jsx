import React from "react";
import brand1 from "../../../public/images/brand1.jpg";
import brand2 from "../../../public/images/brand2.jpg";
import brand3 from "../../../public/images/brand3.png";
import brand4 from "../../../public/images/brand4.png";
import brand5 from "../../../public/images/brand5.png";
import { Link, useNavigate } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import { useEffect } from "react";
import { getTopSeller } from "../../api/userAPI";
import { getProductsBySellerId } from "../../api/productAPI";

const TopSellerSection = () => {
  // const brands = [
  //   { id: 1, name: "Brand 1", image: brand1 },
  //   { id: 2, name: "Brand 2", image: brand2 },
  //   { id: 3, name: "Brand 3", image: brand3 },
  //   { id: 4, name: "Brand 4", image: brand4 },
  //   { id: 5, name: "Brand 5", image: brand5 },
  //   { id: 6, name: "Brand 6", image: brand1 },
  //   { id: 7, name: "Brand 7", image: brand2 },
  //   { id: 8, name: "Brand 8", image: brand3 },
  //   { id: 9, name: "Brand 9", image: brand4 },
  //   { id: 10, name: "Brand 10", image: brand5 },
  // ];

  const [sellers, setSellers] = useState([]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  useEffect(() => {
    const topSeller = async () => {
      try {
        const response = await getTopSeller();
        console.log("Top seller: ", response.data);
        setSellers(response.data);
      } catch (error) {
        console.log("Error fetching top seller: ", error);
      }
    };
    topSeller();
  }, []);

  const itemsPerPage = width > 1024 ? 7 : width > 768 ? 4 : 2; // Dynamically adjust based on width

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex < sellers.length - itemsPerPage) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleTopSellerClick = async (sellerId) => {
    try {
      const response = await getProductsBySellerId(sellerId, 1);
      console.log("Top seller: ", response.data);
      navigate("/product-seller-page", {
        state: { productsBySeller: response.data },
      });
    } catch (error) {
      console.log("Error fetching top seller: ", error);
    }
  };
  return (
    <div className="brand-section">
      <div style={{ padding: 20 }}>
        <div className="title-header">
          <h3 className="h3-title">Thương Hiệu Nổi Bật</h3>
        </div>
        <div className="brand-container">
          <button
            className="arrow-btn left"
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            <KeyboardArrowLeftIcon />
          </button>
          <div className="brand-list">
            {sellers
              .slice(startIndex, startIndex + itemsPerPage)
              .map((seller) => (
                <Link
                  key={seller._id}
                  onClick={() => handleTopSellerClick(seller._id)}
                  className="brand-item"
                >
                  <img
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-cover"
                    src={seller.avata}
                    alt={seller.name}
                  />
                </Link>
              ))}
          </div>
          <button
            className="arrow-btn right"
            onClick={handleNext}
            disabled={startIndex >= sellers.length - itemsPerPage}
          >
            <KeyboardArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopSellerSection;
