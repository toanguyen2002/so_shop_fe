import React, { useState } from "react";
import "./ProductDetail.css";
import Navbar from "../../components/Navbar/Navbar";
import product1 from "../../../public/images/product1.webp";
import product2 from "../../../public/images/product2.webp";
import product3 from "../../../public/images/product3.webp";
import product4 from "../../../public/images/product4.webp";
import prodBanner1 from "../../../public/images/prodBanner1.webp";
import prodBanner2 from "../../../public/images/prodBanner2.webp";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Rating, Typography } from "@mui/material";
import FooterSection from "../../components/Sections/FooterSection";
import DetailList from "../../components/DetailList/DetailList";
import PurchaseModal from "../../components/PurchaseModal/PurchaseModal";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllCategories } from "../../features/cateSlice";
import { addToCart } from "../../api/cartAPI";
import Notification from "../../components/Notification/Notification";
import { getProductById } from "../../api/productAPI";
import { getAllCate } from "../../api/cateAPI";
import OrderSuccessModal from "../../components/Modal/OrderSuccessModal";
import CommentSection from "../../components/Sections/CommentSection";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state.product;
  const [attributesData, setAttributesData] = useState([]);
  const [descriptionData, setDescriptionData] = useState([]);
  const [category, setCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.images[0]);
  const [startIndex, setStartIndex] = useState(0);
  const [rating, setRating] = useState(4);
  const [quantity, setQuantity] = useState(1);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [groupClassifies, setGroupClassifies] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  const [isModalSuccessOrderOpen, setModalSuccessOrderOpen] = useState(false);

  const [itemPurchase, setItemPurchase] = useState({
    buyer: "",
    productId: "",
    productName: "",
    category: "",
    classifyId: "",
    seller: "",
    numberProduct: 0,
    price: 0,
  });

  const user = useSelector((state) => state.auth.user);

  const itemAddToCart = {
    buyer: user._id,
    productId: "",
    classifyId: "",
    seller: "",
    numberProduct: quantity,
  };

  useEffect(() => {
    console.log(product);
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.status === 200) {
          setAttributesData(response.data[0].attributes);
          setDescriptionData(response.data[0].decriptions);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log(descriptionData);
  }, [descriptionData]);

  useEffect(() => {
    console.log("Selected Classify: ", selectedOptions);
  }, [selectedOptions]);

  const [images, setImages] = useState(product.images);
  const visibleThumbnail = images.slice(startIndex, startIndex + 3);

  // find category name by category id
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCate();
        if (response.status === 200) {
          const category = response.data.find(
            (cate) => cate._id === product.cate
          );
          setCategory(category.categoriesName);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, [product]);

  // group classifies by key
  useEffect(() => {
    if (product && product.classifies) {
      const grouped = product.classifies.reduce((groups, classify) => {
        if (!groups[classify.key]) {
          groups[classify.key] = [];
        }
        groups[classify.key].push(classify);
        return groups;
      }, {});
      setGroupClassifies(grouped);
    }
  }, [product]);

  // handle option change
  const handleOptionChange = (key, classify) => {
    if (classify.stock > 0) {
      setSelectedOptions(classify);
    }
  };

  // get the lowest price of all classifies
  const getPrice = (classifies) => {
    if (!classifies || classifies.length === 0) return 0; // Return 0 if no classifies
    const prices = classifies
      .map((classify) => classify.price)
      .filter((price) => price > 0);
    return prices.length > 0 ? Math.min(...prices) : 0; // Return the minimum price, or 0 if no valid prices
  };

  // Calculate total price based on selected option
  const calculateTotalPrice = () => {
    if (selectedOptions && selectedOptions.price > 0) {
      return selectedOptions.price * quantity;
    }
    // Return the lowest price if no classification is selected
    const allClassifies = Object.values(groupClassifies).flat();
    console.log(allClassifies);
    return getPrice(allClassifies) * quantity;
  };

  // scroll to top when component mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (startIndex < images.length - 3) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleKeyChange = (key) => {
    setSelectedKey(key);
    setSelectedValue("");
  };

  const handleValueChange = (value) => {
    setSelectedValue(value);
    setSelectedOptions(value);
  };

  const handleMouseEnter = (image) => {
    setCurrentImage(image);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + delta));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    itemAddToCart.productId = product._id;
    itemAddToCart.seller = product.seller;
    itemAddToCart.classifyId = selectedOptions._id;
    console.log(itemAddToCart);
    try {
      const response = await addToCart(itemAddToCart);
      if (response.status === 201) {
        setShowNotification(true);

        console.log(response);
      } else {
        alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyNowClick = () => {
    const item = {
      buyer: user._id,
      productId: product._id,
      productName: product.productName,
      brand: product.brand,
      image: product.images[0],
      categoryName: category,
      classify: selectedOptions,
      seller: product.seller,
      numberProduct: quantity,
      price: calculateTotalPrice(),
    };
    setItemPurchase(item);
    setIsModalOpen(true);
    console.log(itemPurchase);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      {showNotification && (
        <Notification
          message="Thêm sản phẩm vào giỏ hàng thành công!"
          onClose={() => setShowNotification(false)}
        />
      )}
      <Navbar />
      <div className="product-detail-container">
        <div className="product-detail-image">
          <div className="main-image">
            <img src={currentImage} alt="Product" />
          </div>
          <div className="thumbnail-section">
            <button
              // className="arrow-btn"
              onClick={handlePrev}
              disabled={startIndex === 0}
            >
              <KeyboardArrowLeftIcon />
            </button>
            <div className="thumnail-container">
              {visibleThumbnail.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${index + 1}`}
                  onMouseEnter={() => handleMouseEnter(image)}
                  className={currentImage === image ? "active" : ""}
                />
              ))}
            </div>
            <button
              // className="arrow-btn"
              onClick={handleNext}
              disabled={startIndex >= images.length - 3}
            >
              <KeyboardArrowRightIcon />
            </button>
          </div>
        </div>
        <div className="product-detail-info">
          <div className="detail-name">
            <h3>{product.productName}</h3>
          </div>
          <div className="detail-address">
            <span>Địa chỉ: </span>
            <span>TP.Hồ Chí Minh, Việt Nam.</span>
          </div>

          <div className="detail-inline">
            <div className="product-type">
              <span>Danh mục: </span>
              <span>{category}</span>
            </div>
            <div className="product-rating" style={{ marginLeft: "30%" }}>
              <Rating name="read-only" size="small" value={rating} readOnly />
              <Typography variant="body2" color="text.secondary">
                4.0 (23 đánh giá)
              </Typography>
            </div>
          </div>
          <div className="detail-brand">
            <span>Thương hiệu: </span>
            <a href="#">{product.brand}</a>
          </div>
          <div className="detail-price">
            <div className="product-price">
              <span className="text-secondary price-promotional">
                {calculateTotalPrice() >= 1000
                  ? calculateTotalPrice().toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : `${calculateTotalPrice()} đ`}
              </span>
              {/* <span className="text-primary price-original">
                {getPrice(product.classifies).toLocaleString("vi-VN")}đ
              </span> */}
            </div>
            <div>
              <span>Đã bán: </span>
              <span className="text-secondary">{product.selled}</span>
              <span> sản phẩm</span>
            </div>
          </div>

          <div className="detail-classifies">
            {Object.keys(groupClassifies).map((key) => (
              <button
                key={key}
                className={`key-btn ${selectedKey === key ? "selected" : ""}`}
                onClick={() => handleKeyChange(key)}
              >
                {key}
              </button>
            ))}
          </div>
          {selectedKey && (
            <div className="detail-classifies-values">
              {groupClassifies[selectedKey].map((classify) => (
                <button
                  key={classify._id}
                  className={`value-btn ${
                    selectedValue._id === classify._id ? "selected" : ""
                  }`}
                  onClick={() =>
                    classify.stock > 0 && handleValueChange(classify)
                  } // Only allow selection if stock > 0
                  disabled={classify.stock === 0} // Disable if out of stock
                >
                  {classify.value} (
                  {classify.stock > 0 ? "Còn hàng" : "Hết hàng"})
                </button>
              ))}
            </div>
          )}

          <div className="detail-quantity">
            <span>Số lượng: </span>
            <div className="product-quantity">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="subtraction"
              >
                -
              </button>
              <input type="text" value={quantity} readOnly />
              <button
                onClick={() => handleQuantityChange(+1)}
                className="addition"
              >
                +
              </button>
            </div>
          </div>
          <div className="detail-action">
            <button
              onClick={handleAddToCart}
              disabled={!selectedOptions._id}
              className="add-cart-btn"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNowClick}
              disabled={!selectedOptions._id}
              className="buy-now-btn"
            >
              Mua ngay
            </button>
            <PurchaseModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              // product={product}
              product={itemPurchase}
              onShowSuccessOrderModal={() => setModalSuccessOrderOpen(true)}
            />
            {/* OrderSuccessModal controlled from parent */}
            <OrderSuccessModal
              isOpen={isModalSuccessOrderOpen}
              onClose={() => setModalSuccessOrderOpen(false)}
            />
          </div>
        </div>
      </div>
      <div className="product-about">
        <div className="detail-product">
          <h2>Mô tả sản phẩm</h2>
          <DetailList details={attributesData} />
          {/* <div className="rating-section">
            <h3>Đánh Giá Sản Phẩm</h3>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
            />
          </div> */}
        </div>
        <div className="detail-product">
          <h2>Thông tin sản phẩm</h2>
          <DetailList details={descriptionData} />
        </div>
        {/* <div className="detail-banner">
          <img src={prodBanner1} alt="Banner" />
          <img src={prodBanner2} alt="Banner" />
        </div> */}
      </div>
      {/* Comment Section */}
      {/* <div className="product-comment">
        <CommentSection productId={product._id} />
      </div> */}
      <div className="product-footer">
        <FooterSection />
      </div>
    </div>
  );
};

export default ProductDetail;
