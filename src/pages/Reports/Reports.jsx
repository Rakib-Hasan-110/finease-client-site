import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext/ThemeContext";
import { getAuth } from "firebase/auth";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Reports = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          `https://finease-server-snowy.vercel.app/transactions?email=${user.email}`, // ✅ FIX: Changed '/addtranstion' to '/transactions'
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    if (user?.email) {
      fetchTransactions();
    }
  }, [user?.email]);

  useEffect(() => {
    let data = transactions;

    if (filterMonth !== "") {
      data = data.filter(
        (t) => new Date(t.date).getMonth() === parseInt(filterMonth)
      );
    }

    if (filterCategory !== "") {
      data = data.filter((t) => t.category === filterCategory);
    }

    setFilteredData(data);
  }, [filterMonth, filterCategory, transactions]);

  const categoryData = filteredData.reduce((acc, t) => {
    // Only aggregate expenses for the pie chart logic
    if (t.type === "Expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  const monthlyExpenseData = transactions.reduce((acc, t) => {
    if (t.type === "Expense") {
      const month = new Date(t.date).getMonth();
      acc[month] = (acc[month] || 0) + t.amount;
    }
    return acc;
  }, {});

  const monthlyLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyExpenses = monthlyLabels.map(
    (label, index) => monthlyExpenseData[index] || 0
  );

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#f87171", // red-400
          "#fb923c", // orange-400
          "#facc15", // yellow-400
          "#a3e635", // lime-400
          "#34d399", // emerald-400
          "#22d3ee", // cyan-400
          "#60a5fa", // blue-400
          "#a78bfa", // violet-400
          "#f472b6", // pink-400
          "#c4b5fd", // slate-400
        ],
        hoverBackgroundColor: [
          "#dc2626", // red-600
          "#ea580c", // orange-600
          "#eab308", // yellow-600
          "#65a30d", // lime-600
          "#059669", // emerald-600
          "#06b6d4", // cyan-600
          "#2563eb", // blue-600
          "#7c3aed", // violet-600
          "#db2777", // pink-600
          "#8b5cf6", // slate-600
        ],
      },
    ],
  };

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyExpenses,
        backgroundColor: "rgba(16, 185, 129, 0.7)", // emerald-500
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  const allCategories = [...new Set(transactions.map((t) => t.category))];

  return (
    <section
      className={`min-h-screen py-16 px-6 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-green-50 to-teal-100 text-gray-800"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        <h1
          className={`text-4xl font-extrabold text-center mb-10 tracking-wide ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Financial Reports
        </h1>

        {/* Filter Section */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-10 p-6 rounded-xl shadow-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Month Filter */}
          <div className="flex-1">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Month
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className={`w-full p-3 rounded-lg border outline-none transition-all duration-150 ${
                isDarkMode
                  ? "bg-gray-900 border-teal-600 text-gray-200 hover:border-teal-400"
                  : "border-teal-400 text-gray-700 hover:border-teal-600"
              }`}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option value={i} key={i}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full p-3 rounded-lg border outline-none transition-all duration-150 ${
                isDarkMode
                  ? "bg-gray-900 border-teal-600 text-gray-200 hover:border-teal-400"
                  : "border-teal-400 text-gray-700 hover:border-teal-600"
              }`}
            >
              <option value="">All Categories</option>
              {allCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div
            className={`p-6 rounded-xl shadow-xl hover:shadow-2xl transition ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-green-100 to-teal-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-teal-300" : "text-teal-800"
              }`}
            >
              Expenses by Category
            </h2>
            {filteredData.length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p
                className={`text-center mt-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No data available
              </p>
            )}
          </div>

          <div
            className={`p-6 rounded-xl shadow-xl hover:shadow-2xl transition ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-teal-100 to-green-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-4 ${
                isDarkMode ? "text-teal-300" : "text-teal-800"
              }`}
            >
              Monthly Expenses
            </h2>
            {filteredData.length > 0 ? (
              <Bar data={barData} options={{ responsive: true }} />
            ) : (
              <p
                className={`text-center mt-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Table/Summary Section (Optional, can be added here) */}
      </div>
    </section>
  );
};

export default Reports;