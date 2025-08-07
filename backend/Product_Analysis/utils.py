import requests
from bs4 import BeautifulSoup
from .models import Product, Review  # ✅ Import the database models



from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import requests
from .models import Product, Review  # Import your Django models

def scrape_amazon_product(product_url):
    """Scrapes product details, images, and reviews from an Amazon product page using Selenium."""
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Initialize WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # Open the product URL
        driver.get(product_url)
        time.sleep(5)  # Wait for JavaScript to load content

        # Get page source and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, "html.parser")

        def safe_find_text(selector):
            """Extract text safely from a given CSS selector."""
            element = soup.select_one(selector)
            return element.text.strip() if element else "Not Available"

        # Extract product image
        main_image = soup.find("img", {"id": "landingImage"})
        image_url = main_image["src"] if main_image and "src" in main_image.attrs else "Not Available"

        # Extract product details
        product_data = {
            "title": safe_find_text("#productTitle"),
            "image": image_url,
            "price": safe_find_text(".a-price .a-offscreen"),
            "rating": safe_find_text(".a-icon-alt"),
            "num_reviews": safe_find_text("#acrCustomerReviewText"),
            "availability": safe_find_text("#availability"),
            "description": safe_find_text("#feature-bullets"),
            "url": product_url
        }

        # ✅ Store product in the database
        product, created = Product.objects.get_or_create(url=product_url, defaults=product_data)

        # ✅ Now Scrape Reviews
        reviews = []
        review_elements = soup.select(".review-text-content span")  # Adjust if Amazon changes structure

        for review in review_elements[:10]:  # Get top 10 reviews
            review_text = review.text.strip()
            if review_text:
                reviews.append(review_text)
                Review.objects.create(product=product, content=review_text)  # ✅ Store in DB

        product_data["reviews"] = reviews  # ✅ Include reviews in API response

        return product_data

    except Exception as e:
        return {"error": f"Failed to scrape product: {e}"}

    finally:
        driver.quit()  # Close WebDriver


import google.generativeai as genai
from django.conf import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)
import re

def clean_review_text(text):
    # Remove markdown-style bolding (**text**)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    
    # Remove stars (*) used for bullet points
    text = text.replace('* ', '')
    
    # Remove newlines (\n) and replace multiple spaces with a single space
    text = re.sub(r'\n+', ' ', text).strip()
    
    return text

def analyze_review_sentiment(reviews):
    """Uses Gemini API to analyze sentiment of Amazon reviews"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(f"Analyze the sentiment of these Amazon reviews and summarize them in 5 lines : {reviews}")
        cleaned_text = clean_review_text(response.text)
        
        return cleaned_text if response else "Sentiment analysis failed."
    
    except Exception as e:
        return f"Error: {str(e)}"



def detect_fake_reviews(reviews):
    """Uses Gemini API to detect fake reviews from Amazon product page"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(f""" I am considering buying some product Here are some reviews for the product:
Please analyze these reviews  and:

Summarize the most common pros and cons mentioned by reviewers.

Identify any recurring issues or standout features.

Highlight any patterns in the reviews (e.g., complaints about durability, praise for performance).

Based on the reviews, provide a brief recommendation on whether this product is worth buying or not, and why. {reviews}""")
        
        return response.text if response else "Fake review detection failed."
    
    except Exception as e:
        return f"Error: {str(e)}"


def categorize_reviews(reviews):
    """Categorizes Amazon reviews into Positive & Negative using Gemini API"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            f"Classify these reviews into 'Positive' and 'Negative'. Provide 10 from each category: {reviews}"
        )
        return response.text if response else "Review categorization failed."
    
    except Exception as e:
        return f"Error: {str(e)}"




def predict_product_worthiness(product_data):
    """Uses Gemini AI to determine if a product is worth buying"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(
            f"Based on the following details, should a user buy this product? Provide a percentage recommendation: answer should be in just 3 lines\n{product_data}"
        )
        return response.text if response else "Product prediction failed."
    
    except Exception as e:
        return f"Error: {str(e)}"



from .models import Review

import joblib
import re
import string
import nltk
from nltk.corpus import stopwords

# Load model and vectorizer

svm_model = joblib.load("svm_fake_review_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Download stopwords
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

# Function to clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)
    text = " ".join([word for word in text.split() if word not in stop_words])
    return text



def classify_review_text(review_text):
    """Classify review text without requiring an API request"""
    if not review_text:
        return "Unknown"  # Fallback if empty

    cleaned_review = clean_text(review_text)
    transformed_review = vectorizer.transform([cleaned_review])
    prediction = svm_model.predict(transformed_review)

    return "Real" if prediction == 1 else "Fake"

