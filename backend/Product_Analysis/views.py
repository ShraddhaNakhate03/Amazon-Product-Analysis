from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .utils import (
                    scrape_amazon_product,
                    analyze_review_sentiment,
                    detect_fake_reviews,
                    categorize_reviews,
                    predict_product_worthiness,
                
                    )
from .models import Product, Review

from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def get_product_data(request):
    print("Authorization Header:", request.headers.get("Authorization"))
    product_url = request.data.get("url")
    if not product_url:
        return Response({"error": "Product URL is required"}, status=400)

    # ✅ Check if product exists in DB before scraping
    product = Product.objects.filter(url=product_url).first()
    if product:
        reviews = Review.objects.filter(product=product).values_list("content", flat=True)
        sentiment_analysis = analyze_review_sentiment(" ".join(reviews)) if reviews else "No reviews available"
        
        return Response({
            "product": {
                "title": product.title,
                "image": product.image,
                "price": product.price,
                "rating": product.rating,
                "num_reviews": product.num_reviews,
                "availability": product.availability,
                "description": product.description,
                "url": product.url,
                "reviews": list(reviews),
            },
            "sentiment": sentiment_analysis
        })

    # ✅ If not found in DB, scrape the product
    product_data = scrape_amazon_product(product_url)

    if "error" in product_data:
        return Response({"error": product_data["error"]}, status=500)

    # ✅ Perform AI analysis on reviews
    sentiment_analysis = analyze_review_sentiment(" ".join(product_data.get("reviews", [])))

    return Response({
        "product": product_data,
        "sentiment": sentiment_analysis
    })


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def analyze_reviews(request):
    url = request.data.get("url")
    
    if not url:
        return Response({"error": "Amazon product URL is required"}, status=400)
    
    product_data = scrape_amazon_product(url)
    # print(product_data)
    sentiment_analysis = analyze_review_sentiment(product_data["description"])
    real_reviews = detect_fake_reviews(product_data["reviews"])

    return Response({
        "product": product_data['title'],
        "image" : product_data['image'],
        "price": product_data['price'],
        "rating" : product_data['rating'],
        "sentiment" : sentiment_analysis,
        "filtered_reviews": real_reviews,
    })



@csrf_exempt
@permission_classes([AllowAny])
@api_view(["POST"])
def categorize_reviews_view(request):
    url = request.data.get("url")
    
    if not url:
        return Response({"error": "Amazon product URL is required"}, status=400)
    
    product_data = scrape_amazon_product(url)
    categorized_reviews = categorize_reviews(product_data["reviews"])

    return Response({
        "product": product_data,
        "categorized_reviews": categorized_reviews,
    })


@csrf_exempt
@permission_classes([AllowAny])
@api_view(["POST"])
def predict_buy_product(request):
    product = request.data.get("product")  # Receive full product data

    if not product:
        return Response({"error": "Product data is required"}, status=400)

    # Perform buy recommendation prediction using received product data
    buy_recommendation = predict_product_worthiness(product)

    return Response({
        "product": product,
        "buy_recommendation": buy_recommendation,
    })

from .serializers import FeedbackSerializer

@csrf_exempt

@api_view(["POST"])
def submit_feedback(request):
    serializer = FeedbackSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Feedback submitted successfully!"}, status=201)
    
    return Response(serializer.errors, status=400)



from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product, Review
from .utils import classify_review_text  # Import the new function
@csrf_exempt
@permission_classes([AllowAny])
@api_view(["GET"])
def get_real_and_fake_reviews(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if not product.reviews.exists():
        return Response({"error": "No reviews found for this product"}, status=404)

    real_reviews = []
    fake_reviews = []

    for review in product.reviews.all():
        classification = classify_review_text(review.content)  # ✅ Now works correctly
        if classification == "Real":
            real_reviews.append(review.content)
        else:
            fake_reviews.append(review.content)

    return Response({
        "top_real_reviews": real_reviews[:10],  # Return top 10 real reviews
        "top_fake_reviews": fake_reviews[:10]   # Return top 10 fake reviews
    }, status=200)



from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product, Review
import google.generativeai as genai
import os

import google.generativeai as genai
from django.conf import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)



def get_alternative_products(product_name, product_description):
    """
    Uses Google Gemini AI to suggest alternative products.
    """
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = f"""
    I need 3 alternative product recommendations for: {product_name}.
    Here are its key features: {product_description}.
    
    Provide the following details for each alternative:
    - Product Name
    - Price Range (e.g., Rs100-Rs200)
    - Rating (out of 5)
    - One key feature or reason why it's a good alternative.

    Format the response as a list of JSON objects.
    """
    
    response = model.generate_content(prompt)
    
    # Extract AI-generated response
    try:
        alternative_products = eval(response.text)  # Convert AI response to list of dictionaries
        return alternative_products[:3]  # Return top 3 alternatives
    except Exception as e:
        return [{"error": "Failed to generate alternative products"}]

@api_view(["GET"])
def product_recommendation(request, product_id):
    """
    Provides a recommendation to buy or not buy a product based on sentiment analysis and review scores.
    Uses Google Gemini AI to suggest alternative products.
    """
    product = get_object_or_404(Product, id=product_id)
    reviews = Review.objects.filter(product=product)

    if not reviews.exists():
        return Response({"message": "No reviews available for this product."}, status=404)

    # ✅ Get ratings from reviews safely
    ratings = [review.rating for review in reviews if review.rating is not None]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0  # ✅ Avoid crash if no ratings exist

    # Define a threshold for recommendation
    recommendation = "Buy" if avg_rating >= 3.5 else "Don't Buy"

    # Use Gemini AI for alternative product recommendations
    alternative_products = get_alternative_products(product.title, product.description)

    return Response({
        "product_id": product.id,
        "product_name": product.title,
        "product_price": product.price,
        "product_rating": avg_rating,
        "recommendation": recommendation,
        "alternative_products": alternative_products
    })
