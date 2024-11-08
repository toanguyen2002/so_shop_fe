import React from "react";
import { useEffect } from "react";
import {
  getTradeBySellerAPI,
  getTradeInYearAPI,
} from "../../../../api/tradeAPI";
import { getProductById } from "../../../../api/productAPI";
import { useSelector } from "react-redux";
import { useState } from "react";
import CountUp from "react-countup";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [monthlyTradeData, setMonthlyTradeData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersWithDetails = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await getTradeBySellerAPI(
          user._id,
          user.access_token
        );
        if (fetchedOrders.status === 200) {
          console.log("Fetch orders", fetchedOrders.data);

          const detailedOrders = await Promise.all(
            fetchedOrders.data
              .filter((order) => order.products.length === 1)
              .filter(
                (order) =>
                  (order.paymentMethod === "zalo" && order.payment === true) ||
                  order.paymentMethod === "cash"
              )
              .map(async (order) => {
                const productResponse = await getProductById(
                  order.products[0].productId
                );

                if (productResponse.status === 200) {
                  const productData = productResponse.data[0];

                  return {
                    ...order,
                    productName: productData.productName,
                    image: productData.images?.[0] || "",
                    brand: productData.brand,
                    category: productData.category,
                    numberProduct: order.products[0].numberProduct,
                    phoneContact: user.number,
                    status: order.isCancel
                      ? "Cancel"
                      : order.sellerAccept
                      ? "Approval"
                      : "Pending",
                    statusColor: order.isCancel
                      ? "text-red-500"
                      : order.sellerAccept
                      ? "text-green-500"
                      : "text-yellow-500",
                    paymentMethod:
                      order.paymentMethod == "cash"
                        ? "Thanh toán khi nhận hàng"
                        : "ZaloPay",
                  };
                }
                return order;
              })
          );

          setOrders(detailedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersWithDetails();
  }, [user._id, user.access_token]);

  // Count orders by status
  const orderCounts = orders.reduce(
    (counts, order) => {
      if (order.status === "Pending") counts.pending += 1;
      if (order.status === "Cancel") counts.canceled += 1;
      if (order.status === "Approval") counts.approved += 1;
      return counts;
    },
    { pending: 0, canceled: 0, approved: 0 }
  );

  // Fetch Trade Data for the Year
  useEffect(() => {
    const fetchTradeInYear = async () => {
      try {
        const response = await getTradeInYearAPI(user._id);
        if (response.status === 201) {
          const sortedData = response.data.sort((a, b) => a.month - b.month);
          setMonthlyTradeData(sortedData);
          console.log("Trade data for the year:", response.data);
        }
      } catch (error) {
        console.error("Error fetching trade data for the year:", error);
      }
    };

    fetchTradeInYear();
  }, [user._id]);

  // Calculate total revenue
  const totalRevenue = monthlyTradeData.reduce(
    (total, data) => total + data.totalBalance,
    0
  );

  const chartData = {
    labels: monthlyTradeData.map((data) => `Month ${data.month}`),
    datasets: [
      {
        label: "Total Balance",
        data: monthlyTradeData.map((data) => data.totalBalance),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Balance (VND)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Order Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-yellow-500 text-white text-center rounded-lg">
          <h3>Order Pending</h3>
          <CountUp end={orderCounts.pending} duration={2} />
        </div>
        <div className="p-4 bg-red-500 text-white text-center rounded-lg">
          <h3>Order Cancel</h3>
          <CountUp end={orderCounts.canceled} duration={2} />
        </div>
        <div className="p-4 bg-green-500 text-white text-center rounded-lg">
          <h3>Order Approval</h3>
          <CountUp end={orderCounts.approved} duration={2} />
        </div>
      </div>

      {/* Monthly Trade Data */}
      <div className="flex space-x-4">
        <div className="w-2/3 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Monthly Trade Data</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold mb-2 text-center">
              Total Revenue
            </h2>
            <p className="text-3xl font-semibold text-center text-green-600">
              <CountUp end={totalRevenue} duration={2} /> VND
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
