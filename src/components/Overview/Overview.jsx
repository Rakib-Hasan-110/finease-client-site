import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext/ThemeContext";
import Loading from "../../components/Loading/Loading";

const Overview = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = await user.getIdToken();

        const res = await axios.get(
          `https://finease-server-snowy.vercel.app/transactions?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load transaction data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type?.toLowerCase() === "income") totalIncome += amt;
      if (t.type?.toLowerCase() === "expense") totalExpense += amt;
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
  }, [transactions]);

  const balance = income - expense;

  // Compact card styles
  const cardBg = isDarkMode
    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 border border-gray-700"
    : "bg-gradient-to-r from-white to-gray-50 text-gray-800 border border-gray-200";

  const incomeBg = isDarkMode
    ? "bg-gradient-to-r from-green-800 to-green-900 text-gray-200 border border-green-700"
    : "bg-gradient-to-r from-green-50 to-green-100 text-gray-800 border border-green-200";

  const expenseBg = isDarkMode
    ? "bg-gradient-to-r from-red-800 to-red-900 text-gray-200 border border-red-700"
    : "bg-gradient-to-r from-red-50 to-red-100 text-gray-800 border border-red-200";

  if (loading) {
    return (
      <div className={`min-h-40 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-40 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}>
        <div className={`text-center p-4 rounded-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
          <h2 className="text-lg font-bold mb-1">Error</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-40 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}>
        <div className={`text-center p-4 rounded-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
          <h2 className="text-lg font-bold mb-1">Please Login</h2>
          <p className="text-sm text-gray-500">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} pb-8`}>
      <div className="max-w-[1500px] mx-auto py-8 px-6">
        {/* Compact Header */}
        <h1
          className={`text-2xl font-bold mb-6 text-center ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Dashboard Overview
        </h1>

        {/* Compact Cards Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Total Balance Card */}
          <div
            className={`${cardBg} shadow-md rounded-lg p-4 flex items-center gap-4 transition hover:shadow-lg`}
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
              <FaWallet size={20} />
            </div>
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Total Balance
              </p>
              <h2 className="text-xl font-bold mt-1">
                {balance.toFixed(2)}৳
              </h2>
            </div>
          </div>

          {/* Total Income Card */}
          <div
            className={`${incomeBg} shadow-md rounded-lg p-4 flex items-center gap-4 transition hover:shadow-lg`}
          >
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full">
              <FaArrowUp size={20} />
            </div>
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Total Income
              </p>
              <h2 className="text-xl font-bold mt-1">
                {income.toFixed(2)}৳
              </h2>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div
            className={`${expenseBg} shadow-md rounded-lg p-4 flex items-center gap-4 transition hover:shadow-lg`}
          >
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full">
              <FaArrowDown size={20} />
            </div>
            <div className="flex-1">
              <p className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Total Expenses
              </p>
              <h2 className="text-xl font-bold mt-1">
                {expense.toFixed(2)}৳
              </h2>
            </div>
          </div>
        </div>

        {/* Compact Stats Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Transaction Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Total Transactions</span>
                <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {transactions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Income Transactions</span>
                <span className="font-bold text-green-500">
                  {transactions.filter(t => t.type?.toLowerCase() === "income").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Expense Transactions</span>
                <span className="font-bold text-red-500">
                  {transactions.filter(t => t.type?.toLowerCase() === "expense").length}
                </span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Financial Health
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Savings Rate</span>
                <span className={`font-bold ${
                  income > 0 ? (balance / income * 100 > 20 ? "text-green-500" : "text-yellow-500") : "text-gray-500"
                }`}>
                  {income > 0 ? ((balance / income) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Expense Ratio</span>
                <span className="font-bold text-red-500">
                  {income > 0 ? ((expense / income) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Net Worth</span>
                <span className={`font-bold ${
                  balance > 0 ? "text-green-500" : balance < 0 ? "text-red-500" : "text-gray-500"
                }`}>
                  {balance > 0 ? "Positive" : balance < 0 ? "Negative" : "Neutral"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;