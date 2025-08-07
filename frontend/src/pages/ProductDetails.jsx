import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
 




const ProductDetails = () => {

  
  const [productUrl, setProductUrl] = useState(localStorage.getItem("productUrl") || '');
const [productData, setProductData] = useState(() => {
  const savedData = localStorage.getItem("productData");
  return savedData ? JSON.parse(savedData) : null;
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setProductUrl(e.target.value);
  };
  
  const goToBuyRecommendation = () => {
    navigate("/product-buy", { state: { productData } });
  };

  const handleScrape = async () => {
    if (!productUrl) {
      setError('Please enter a valid product URL.');
      return;
    }
  
    setError(null);
    setLoading(true);
  
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/scrape/products/get-product-data/',
        { url: productUrl },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setProductData(response.data);
      localStorage.setItem("productUrl", productUrl); // Save URL
      localStorage.setItem("productData", JSON.stringify(response.data)); // Save product details
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch product data. Please check the URL and try again.');
      console.error('Error fetching product data:', err);
    }
  };
  

  const separateReviews = (reviewsText) => {
    const reviewsString = reviewsText ? reviewsText.toString() : '';
    const reviewsArray = reviewsString.split('\n\n').filter((review) => review.trim() !== '');
    return reviewsArray;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-5/6 md:w-5/6 lg:w-5/6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-6">
          Amazon Product Scraper
        </h1>

        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-medium mb-2">Enter Amazon Product URL:</label>
          <input
            type="url"
            value={productUrl}
            onChange={handleInputChange}
            placeholder="Paste Amazon Product URL"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleScrape}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Scrape Product
        </button>

        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
        {loading && <div className="mt-4 text-center text-indigo-600">Loading...</div>}

        {productData && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Details:</h2>
            <div className="mb-4">
              {/* Product Image Placeholder */}
              <div className="w-full h-48 bg-white flex items-center justify-center rounded-md shadow-md">
                {productData.product.image ? (
                  <img
                    src={productData.product.image}
                    alt={productData.product.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-600">No Image Available</p>
                )}
              </div>

              <h3 className="font-bold text-xl mt-4">{productData.product.title}</h3>
              <p className="text-gray-600 text-sm">{productData.product.description}</p>

              <div className="flex justify-between mt-6">
                <span className="text-xl font-semibold text-indigo-600">{productData.product.price}</span>
                <span className="text-xl font-semibold text-yellow-600">{productData.product.rating} ⭐</span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <p>{productData.product.num_reviews} reviews</p>
                <p>Availability: {productData.product.availability}</p>
              </div>
              <a
                href={productData.product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-indigo-600 hover:text-indigo-800"
              >
                View Product on Amazon
              </a>

              {/* Sentiment Analysis Section */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-gray-800">Sentiment Analysis:</h4>
                <p className="text-gray-500 text-sm">{productData.sentiment || "Not Available"}</p>
              </div>

              {/* Reviews */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Reviews:</h3>
                <button
                  onClick={() => navigate("/ReviewAnalysis", { state: { productUrl } })}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                >
                  Analyze Reviews with AI
                </button>

                <button
  onClick={goToBuyRecommendation}
  className="ml-150 mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
>
  Should I Buy This AI ?
</button>
                
                {separateReviews(productData.product.reviews).map((review, index) => (
                  <div key={index} className="mb-4 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">{review}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
