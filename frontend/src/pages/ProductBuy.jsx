// ProductPredictionPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductBuy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get product data from ProductDetails page
  useEffect(() => {
    if (location.state?.productData) {
      setProductData(location.state.productData);
    } else {
      // Redirect back to product details if no data
      navigate('/ProductDetails');
    }
  }, [location, navigate]);

  // Fetch prediction when product data is available
  useEffect(() => {
    if (productData) {
      fetchPrediction();
    }
  }, [productData]);
  const token = localStorage.getItem('token');
  console.log(token)
  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/scrape/products/predict-buy/',
        { product: productData },
        {
          headers: {
            'Content-Type': 'application/json',
             'Authorization': `Token ${token}`
          },
        }
      );

      setPrediction(response.data.buy_recommendation);
    } catch (err) {
      setError('Failed to analyze product worthiness. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/ProductDetails', { state: { productData } });
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-5/6 md:w-5/6 lg:w-5/6">
        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
          Should I Buy This Product?
        </h1>

        {/* Product Summary */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Product Summary</h2>
          <div className="flex items-center gap-4">
            {productData.product.image && (
              <img
                src={productData.product.image}
                alt={productData.product.title}
                className="w-24 h-24 object-contain"
              />
            )}
            <div>
              <h3 className="font-bold">{productData.product.title}</h3>
              <p className="text-indigo-600">{productData.product.price}</p>
              <p className="text-yellow-600">
                {productData.product.rating} ⭐ ({productData.product.num_reviews} reviews)
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Result */}
        <div className="mb-6">
          {loading && (
            <p className="text-center text-indigo-600">Analyzing product worthiness...</p>
          )}
          {error && (
            <p className="text-center text-red-600">{error}</p>
          )}
          {prediction && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Buy Recommendation</h2>
              <p
                className={`text-lg font-bold ${
                  prediction.toLowerCase().includes('recommend')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {prediction}
              </p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Back to Product Details
        </button>
      </div>
    </div>
  );
};

export default ProductBuy;