import React from "react";
import { useLocation } from "react-router-dom";
import ProductSection from "../Sections/ProductSection";
import { Pagination, Stack } from "@mui/material";
import { useState } from "react";

const ProductSearch = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];
  const valueToSearch = location.state?.valueToSearch || "";
  const productByCate = location.state?.products || [];
  const productsSeller = location.state?.productsBySeller || [];
  const cateName = location.state?.categoryName || "";

  const hasSearchResults = searchResults.length > 0;
  const hasCategoryProducts = productByCate.length > 0;
  const hasProductsSeller = productsSeller.length > 0;

  const totalPages = location.state?.totalPages || 2;

  const [currentPage, setCurrentPage] = useState(1);

  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-[70%] mx-auto py-8">
        {/* Search Header */}
        <div className="bg-white p-5 rounded-s">
          {valueToSearch && (
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Kết Quả Tìm Kiếm Cho: "{valueToSearch}"
            </h1>
          )}
          {!valueToSearch && cateName && (
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Sản Phẩm Theo Danh Mục: "{cateName}"
            </h1>
          )}
          {hasProductsSeller > 0 && (
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Sản Phẩm Của Shop
            </h1>
          )}
        </div>

        {/* Product Grid */}
        <div className="mt-8">
          {hasSearchResults ? (
            <ProductSection products={searchResults} />
          ) : hasCategoryProducts ? (
            <ProductSection products={productByCate} />
          ) : hasProductsSeller ? (
            <ProductSection products={productsSeller} />
          ) : (
            <p className="text-center text-gray-700">Không có sản phẩm nào.</p>
          )}
        </div>
      </div>
      <div className="page-selection">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                // color: "#8bc34a",
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#8bc34a",
                },
              },
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default ProductSearch;
