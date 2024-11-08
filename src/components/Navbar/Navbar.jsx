import React from "react";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Avatar, Drawer, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import prod1 from "../../../public/images/prod1.webp";
import { useRef } from "react";
import { useEffect } from "react";
import { logout } from "../../features/authSlice";
import { getCartItemByBuyerId } from "../../api/cartAPI";
import {
  getClassifiesByProductId,
  getProductById,
  getProductsBySearching,
} from "../../api/productAPI";
import Loading from "../Loading/Loading";
import useDebounce from "../Hook/useDebounce";
import Notification from "../Notification/Notification";
import { registerSellerAPI } from "../../api/userAPI";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const subNavbarLinksRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  // const history = [];
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(
    searchTerm || "",
    500
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [productData, setProductData] = useState({});
  const [selectedClassifies, setSelectedClassifies] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canRegister, setCanRegister] = useState(true); // Kiểm tra điều kiện đầy đủ thông tin
  const [showNotification, setShowNotification] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleModal = () => {
    // Kiểm tra nếu thông tin user chưa đầy đủ thì không cho gửi đăng ký
    if (
      user &&
      user.name &&
      user.userName &&
      user.number &&
      user.address &&
      user.sex &&
      user.avata
    ) {
      setCanRegister(true);
    } else {
      setCanRegister(false);
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    // setSearchHistory(storedHistory);
    setSearchHistory(storedHistory.filter((term) => typeof term === "string"));
  }, []);

  useEffect(() => {
    if (isFocused) {
      // Chỉ khi input đã được focus
      if (debouncedSearchTerm || !isTyping) {
        setShowHistory(true);
      } else {
        setShowHistory(false);
      }
    } else {
      setShowHistory(false); // Ẩn lịch sử nếu không có focus
    }
  }, [debouncedSearchTerm, isTyping, isFocused]);

  const handleSearch = async (e) => {
    if (!e || (e.type === "keydown" && e.keyCode !== 13)) return;
    // console.log("Handling search for: ", searchTerm); // Log search term
    const valueToSearch = e.target ? e.target.value : searchTerm;
    if (valueToSearch) {
      try {
        console.log("Searching for: ", valueToSearch);
        const response = await getProductsBySearching(valueToSearch);
        const searchResults = response.data;
        console.log("Search results: ", searchResults);

        let updatedHistory = [...new Set([valueToSearch, ...searchHistory])];
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

        setSearchTerm("");
        setShowHistory(false);

        navigate("/search-results", {
          state: { searchResults, valueToSearch },
        });
      } catch (error) {
        console.log("Error searching: ", error);
      }
    }
  };

  const handleClickHistory = (term) => {
    console.log("Clicked on history term: ", term); // Log clicked term
    setSearchTerm(term); // Update the search term
    setShowHistory(false);
    setIsTyping(false); // Reset typing state
    console.log("Updated searchTerm to: ", term); // Log updated search term
    handleSearch({ type: "click", target: { value: term } });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(value.length > 0); // Đánh dấu trạng thái đang gõ khi có văn bản
  };

  const handleFocus = () => {
    setIsFocused(true); // Đặt biến isFocused khi input được nhấp vào
    setShowHistory(true); // Hiển thị lịch sử khi nhấp vào input
  };

  const handleLogout = () => {
    setLoading(true);
    try {
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log("Error logging out: ", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const handleShowCart = async () => {
    const response = await getCartItemByBuyerId(user._id);
    const processedItems = response.data.products.flatMap((product) =>
      product.items.map((item) => ({
        ...item,
        seller: product.seller,
        numberProduct: item.numberProduct || 1,
        price: item.price,
      }))
    );
    setCartItems(processedItems);

    if (isMobile) {
      setOpenDrawer((prev) => !prev);
    } else {
      setShowCart((prev) => !prev);
    }
  };

  // Fetch product data for all product IDs in cartItems
  useEffect(() => {
    const fetchProductData = async () => {
      const productIds = [...new Set(cartItems.map((item) => item.productId))]; // Lấy danh sách productId duy nhất
      const productDataMap = {}; // Dùng để lưu dữ liệu sản phẩm theo productId

      try {
        // Gọi API cho từng productId để lấy thông tin sản phẩm
        await Promise.all(
          productIds.map(async (productId) => {
            const response = await getProductById(productId);
            if (response && response.data && response.data.length > 0) {
              productDataMap[productId] = response.data[0]; // Giả sử API trả về mảng, lấy đối tượng đầu tiên
            }
          })
        );
        setProductData(productDataMap); // Lưu dữ liệu sản phẩm vào state
        console.log("Product data:", productDataMap);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cartItems.length > 0) {
      fetchProductData();
    }
  }, [cartItems]);

  // Fetch selected classify for each product in cartItems
  useEffect(() => {
    const fetchClassifyData = async () => {
      try {
        const classifyMap = {};
        for (const item of cartItems) {
          if (item.productId && item.classifyId) {
            const response = await getClassifiesByProductId(item.productId);
            const allClassifies = response.data;

            const selectedClassify = allClassifies.find(
              (classify) => classify._id === item.classifyId
            );

            if (selectedClassify) {
              classifyMap[`${item.productId}-${item.classifyId}`] =
                selectedClassify;
            }
          }
        }
        setSelectedClassifies(classifyMap);
      } catch (error) {
        console.log(error);
      }
    };
    if (cartItems.length > 0) {
      fetchClassifyData();
    }
  }, [cartItems]);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);

    const subNavbarLinks = document.querySelector(".sub-navbar-links");

    if (!showMenu) {
      // Khi mở menu
      subNavbarLinks.style.maxHeight = `${subNavbarLinks.scrollHeight}px`;
    } else {
      // Khi đóng menu
      subNavbarLinks.style.maxHeight = "0";
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Khi màn hình lớn hơn 768px (tablet/desktop), luôn hiển thị sub-navbar
        if (subNavbarLinksRef.current) {
          subNavbarLinksRef.current.style.maxHeight = "none";
        }
      } else {
        // Khi màn hình nhỏ hơn 768px (mobile), đặt lại trạng thái cho sub-navbar
        if (subNavbarLinksRef.current && !showMenu) {
          subNavbarLinksRef.current.style.maxHeight = "0";
        }
      }
    };
    // Gọi hàm handleResize một lần khi component mount
    handleResize();

    // Thêm sự kiện lắng nghe resize
    window.addEventListener("resize", handleResize);

    // Cleanup khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [showMenu]);

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (cartRef.current && !cartRef.current.contains(e.target)) {
  //       setShowCart(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowProfile = () => {
    console.log("show profile");
    setShowProfile((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false); // Close the dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRegisterSeller = async () => {
    if (canRegister) {
      const formData = {
        id: user._id,
      };
      try {
        const response = await registerSellerAPI(formData, user.access_token);
        console.log("Register seller response: ", response);
        setShowModal(false);
        setShowNotification(true);
      } catch (error) {
        console.log("Error registering seller: ", error);
      }
    }
  };

  return (
    <div className="navbar">
      {loading && <Loading />}
      <nav className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <h2 style={{ color: "#f0f0f0", fontSize: "1.6rem" }}>Ecomerce</h2>
          </div>
          <div className="navbar-search">
            {/* <div className="search-icon">
              <SearchIcon />
            </div> */}
            <input
              value={searchTerm}
              onFocus={handleFocus}
              onChange={handleInputChange}
              onKeyDown={handleSearch}
              className="search-input"
              type="text"
              placeholder="Nhập tên sản phẩm bạn muốn tìm"
            />
            <button className="search-btn" onClick={handleSearch}>
              <SearchIcon />
            </button>
            {showHistory && (
              <div className="search-history">
                {searchHistory.length === 0 ? (
                  <p className="history-item">Chưa có lịch sử tìm kiếm</p>
                ) : isTyping ? (
                  searchHistory
                    .filter((term) => {
                      // Chỉ lọc khi người dùng đang gõ text
                      if (
                        typeof term === "string" &&
                        typeof debouncedSearchTerm === "string"
                      ) {
                        return term
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase());
                      }
                      return false;
                    })
                    .slice(0, 6) // Chỉ hiển thị 6 từ khóa mới nhất
                    .map((term, index) => (
                      <p
                        className="history-item"
                        key={index}
                        onClick={() => handleClickHistory(term)}
                      >
                        {term}
                      </p>
                    ))
                ) : (
                  searchHistory
                    .slice(0, 6) // Hiển thị 6 từ khóa mới nhất khi chưa gõ text
                    .map((term, index) => (
                      <p
                        className="history-item"
                        key={index}
                        onClick={() => handleClickHistory(term)}
                      >
                        {term}
                      </p>
                    ))
                )}
              </div>
            )}
          </div>
          <div className="cart-avatar">
            <div className="navbar-cart" ref={cartRef}>
              <button className="cart-btn" onClick={handleShowCart}>
                <ShoppingCartIcon />
                {/* <span className="cart-count">3</span> */}
              </button>
              {!isMobile && showCart && (
                <div className={`dropdown-content ${showCart ? "show" : ""} `}>
                  <div className="relative">
                    <div className="cart-title">Sản Phẩm Mới Thêm</div>
                    {/* Container có scroll chỉ cho danh sách sản phẩm */}
                    <div className="cart-items-container">
                      {cartItems.map((item) => {
                        const product = productData[item.productId];
                        const classify =
                          selectedClassifies[
                            `${item.productId}-${item.classifyId}`
                          ];
                        const itemPrice = classify?.price || item.price;
                        return (
                          <div
                            className="cart-item-container"
                            key={`${item.productId}-${item.classifyId}`}
                          >
                            <div className="cart-item">
                              <img
                                src={product?.images[0] || prod1}
                                alt={product?.productName || "Product Image"}
                                className="cart-item-img"
                              />
                              <div className="cart-item-info">
                                <span className="cart-item-name">
                                  {product?.productName || "Loading..."}
                                </span>
                                <span className="cart-item-price">
                                  {itemPrice >= 1000
                                    ? itemPrice.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                    : `${itemPrice} đ`}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Nút luôn ở dưới */}
                    <div className="view-cart-container">
                      <a href="/cart" className="view-cart-button">
                        Xem Giỏ Hàng
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {cartItems.map((item) => {
                const product = productData[item.productId];
                const classify =
                  selectedClassifies[`${item.productId}-${item.classifyId}`];
                const itemPrice = classify?.price || item.price;
                return (
                  <Drawer
                    key={`${item.productId}-${item.classifyId}`}
                    anchor="bottom"
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    PaperProps={{
                      style: {
                        height: "60vh",
                        overflow: "auto",
                        padding: "16px",
                      },
                    }}
                    BackdropProps={{
                      style: {
                        backgroundColor: "transparent", // Loại bỏ nền đen khi mở Drawer
                      },
                    }}
                  >
                    <div className="cart-title">Sản Phẩm Mới Thêm</div>
                    <div className="cart-item-container">
                      <div className="cart-item">
                        <img
                          src={product?.images[0] || prod1}
                          alt={product?.productName || "Product Image"}
                          className="cart-item-img"
                        />
                        <div className="cart-item-info">
                          <span className="cart-item-label">
                            Combo khuyến mãi
                          </span>
                          <span className="cart-item-name">
                            {product?.productName}
                          </span>
                          <span className="cart-item-price">
                            {itemPrice >= 1000
                              ? itemPrice.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })
                              : `${itemPrice} đ`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a href="/cart" className="view-cart-button">
                      Xem Giỏ Hàng
                    </a>
                  </Drawer>
                );
              })}
            </div>
            <div className="navbar-avatar">
              {user ? (
                <div ref={profileRef}>
                  <Avatar
                    alt="User"
                    src={user.avata}
                    style={{ cursor: "pointer" }}
                    onClick={handleShowProfile}
                  />
                  {showProfile && (
                    <div
                      className={`dropdown-content dropdown-profile ${
                        showProfile ? "show" : ""
                      }`}
                    >
                      <a href="/profile">Thông Tin Cá Nhân</a>
                      <a href="/orders">Đơn Hàng Của Bạn</a>
                      <a href="/cart">Giỏ Hàng</a>
                      <a onClick={handleLogout}>Đăng Xuất</a>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="nav-auth">
                    <Link className="link" to="/signin">
                      Đăng Nhập
                    </Link>
                    <Link className="link primary-btn" to="/signup">
                      Đăng Ký
                    </Link>
                  </div>
                  <div className="nav-auth-mobile">
                    {/* <AccountCircleOutlinedIcon /> */}
                    <div>
                      <Link className="link" to="/signin">
                        Đăng Nhập
                      </Link>
                      {/* <Link className="link primary-btn" to="/signup">
                        Đăng Ký
                      </Link> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Search bar for mobile */}
        <div className="navbar-search-mobile">
          {/* <div className="search-icon">
            <SearchIcon />
          </div> */}
          <input
            value={searchTerm}
            onFocus={handleFocus}
            onChange={handleInputChange}
            // onBlur={() => setShowHistory(false)}
            onKeyDown={handleSearch}
            className="search-input"
            type="text"
            placeholder="Nhập tên sản phẩm bạn muốn tìm"
          />
          <button className="search-btn" onClick={handleSearch}>
            <SearchIcon />
          </button>
          {showHistory && (
            <div className="search-history">
              {searchHistory.length === 0 ? (
                <p className="history-item">Chưa có lịch sử tìm kiếm</p>
              ) : isTyping ? (
                searchHistory
                  .filter((term) => {
                    // Chỉ lọc khi người dùng đang gõ text
                    if (
                      typeof term === "string" &&
                      typeof debouncedSearchTerm === "string"
                    ) {
                      return term
                        .toLowerCase()
                        .includes(debouncedSearchTerm.toLowerCase());
                    }
                    return false;
                  })
                  .slice(0, 6) // Chỉ hiển thị 6 từ khóa mới nhất
                  .map((term, index) => (
                    <p
                      className="history-item"
                      key={index}
                      onClick={() => handleClickHistory(term)}
                    >
                      {term}
                    </p>
                  ))
              ) : (
                searchHistory
                  .slice(0, 6) // Hiển thị 6 từ khóa mới nhất khi chưa gõ text
                  .map((term, index) => (
                    <p
                      className="history-item"
                      key={index}
                      onClick={() => handleClickHistory(term)}
                    >
                      {term}
                    </p>
                  ))
              )}
            </div>
          )}
        </div>

        <div className="sub-navbar">
          <div>
            <button className="menu-btn" onClick={toggleMenu}>
              ☰ Menu {/* use when reponsive design */}
            </button>
          </div>
          <div
            ref={subNavbarLinksRef}
            className={`sub-navbar-links ${showMenu ? "show" : ""}`}
          >
            <div className="sub-navbar-section">
              <Link className="subnavbar-link" to="/">
                Trang Chủ
              </Link>
              <Link className="subnavbar-link" to="/products">
                Sản phẩm
              </Link>
              {/* <Link className="subnavbar-link" to="/categories">
                Danh Mục
              </Link> */}
            </div>

            <div className="sub-navbar-section">
              {/* <Link className="subnavbar-link" to="/help">
                Hỗ trợ
              </Link> */}
              <Link className="subnavbar-link" to="/contact">
                Liên Hệ
              </Link>

              {user ? (
                <>
                  {user.role.includes("ADMIN") && (
                    <Link className="subnavbar-link" to="/admin">
                      Trang Admin
                    </Link>
                  )}
                  {user.role.includes("SELLER") && (
                    <Link className="subnavbar-link" to="/seller">
                      Trang Người Bán
                    </Link>
                  )}
                  {!user.role.includes("ADMIN") &&
                    !user.role.includes("SELLER") &&
                    user.role.includes("BUYER") && (
                      <span
                        className="subnavbar-link cursor-pointer"
                        onClick={toggleModal}
                      >
                        Trở Thành Người Bán
                      </span>
                    )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-1000 ease-out ${
              showModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Đăng Ký Trở Thành Người Bán
            </h2>
            <p className="mb-2">
              <strong>Họ Tên:</strong> {user.name ? user.name : "Chưa cập nhật"}
            </p>
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              {user.userName ? user.userName : "Chưa cập nhật"}
            </p>
            <p className="mb-2">
              <strong>Số điện thoại:</strong>{" "}
              {user.number ? user.number : "Chưa cập nhật"}
            </p>
            <p className="mb-2">
              <strong>Địa chỉ:</strong>{" "}
              {user.address ? user.address : "Chưa cập nhật"}
            </p>

            <div className="mb-4">
              <strong>Ảnh đại diện cửa hàng:</strong>
              <div className="flex justify-center mt-2">
                <img
                  src={user.avata || ""}
                  alt={`Avatar of ${user.name}`}
                  className="w-[300px] h-[300px] object-fit shadow-md"
                />
              </div>
            </div>

            <button
              className={`w-full py-2 mt-4 text-white rounded ${
                canRegister
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!canRegister}
              onClick={handleRegisterSeller}
            >
              Gửi Đăng Ký
            </button>
            {!canRegister && (
              <p className="text-red-500 text-sm mt-2">
                Vui lòng hoàn thành thông tin của bạn để đăng ký.
              </p>
            )}

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {showNotification && (
        <Notification
          message="Đã gửi đăng ký bán hàng thành công, vui lòng chờ admin duyệt"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
