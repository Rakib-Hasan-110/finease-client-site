import React, { useEffect, useState, useContext } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaMoneyBillWave, FaRegCalendarAlt, FaTag } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading/Loading";

const TransactionDetails = () => {
  const { user } = useContext(AuthContext); 
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Try to get data from loader first, if not available, fetch it
  const loaderData = useLoaderData();
  const [transaction, setTransaction] = useState(loaderData || null);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [loading, setLoading] = useState(!loaderData);
  const [error, setError] = useState(null);

  // If loader didn't provide data, fetch it
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!user || !id || loaderData) return;

      try {
        setLoading(true);
        setError(null);
        const token = await user.getIdToken();
        
        const transactionRes = await axios.get(
          `https://finease-server-snowy.vercel.app/transactions/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (transactionRes.data) {
          setTransaction(transactionRes.data);
        } else {
          throw new Error("Transaction not found");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        setError("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, user, loaderData]);

  // Fetch category total
  useEffect(() => {
    const fetchCategoryTotal = async () => {
      if (!user || !transaction) return;

      try {
        const token = await user.getIdToken();
        const res = await axios.get(
          `https://finease-server-snowy.vercel.app/category-total?email=${user.email}&category=${transaction.category}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setCategoryTotal(res.data.totalAmount || 0);
      } catch (error) {
        console.error("Error fetching category total:", error);
        setCategoryTotal(0);
      }
    };

    if (transaction) {
      fetchCategoryTotal();
    }
  }, [transaction, user]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-green-50"
      }`}>
        <Loading />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-green-50"
      }`}>
        <div className={`text-center p-8 rounded-2xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            {error || "Transaction not found"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-4 py-16 transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-green-50 to-teal-50"
      }`}
    >
      <div
        className={`rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border transition-all duration-500 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div
          className={`px-10 py-8 ${
            isDarkMode
              ? "bg-gradient-to-r from-green-700 via-teal-600 to-teal-500"
              : "bg-gradient-to-r from-green-600 via-teal-500 to-teal-400"
          }`}
        >
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wider">
            Transaction Details
          </h1>
          <p className="text-sm text-green-100/90 font-medium">
            Detailed view of your transaction.
          </p>
        </div>
        
        <div className="p-10">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Row 1: Type & Category */}
            <div className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              <p
                className={`font-semibold mb-1 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <FaTag className="text-teal-500" /> Type
              </p>
              <p
                className={`px-4 py-1 text-sm font-bold rounded-full inline-block ${
                  transaction.type === "Income"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {transaction.type}
              </p>
            </div>
            
            <div className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              <p
                className={`font-semibold mb-1 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <FaTag className="text-teal-500" /> Category
              </p>
              <p className="text-lg font-medium">{transaction.category}</p>
            </div>

            {/* Row 2: Amount & Date */}
            <div className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              <p
                className={`font-semibold mb-1 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <FaMoneyBillWave className="text-teal-500" /> Amount
              </p>
              <p
                className={`text-3xl font-extrabold ${
                  transaction.type === "Income" ? "text-green-500" : "text-red-500"
                }`}
              >
                ৳{parseFloat(transaction.amount).toFixed(2)}
              </p>
            </div>
            
            <div className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              <p
                className={`font-semibold mb-1 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <FaRegCalendarAlt className="text-teal-500" /> Date
              </p>
              <p className="text-lg font-medium">{formatDate(transaction.date)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p
              className={`font-semibold mb-2 text-lg ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Description
            </p>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {transaction.description || "No description provided."}
            </p>
          </div>

          {/* Category Total Summary */}
          <div
            className={`p-6 rounded-xl shadow-inner ${
              isDarkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`font-bold text-lg mb-2 ${
                isDarkMode ? "text-teal-300" : "text-teal-800"
              }`}
            >
              Summary for {transaction.category}:
            </p>
            <p className={`text-xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Total {transaction.type === "Income" ? "Earned" : "Spent"} in this Category: ৳{categoryTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div
          className={`px-8 py-6 flex justify-center transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-700 to-gray-800"
              : "bg-gradient-to-r from-green-100 to-teal-100"
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;