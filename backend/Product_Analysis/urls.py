from django.urls import path
from .views import (
    get_product_data,
    analyze_reviews,
    categorize_reviews_view,
    predict_buy_product,
    submit_feedback,
    get_real_and_fake_reviews,
    product_recommendation,

)

urlpatterns = [
    path("products/get-product-data/", get_product_data, name="get-product-data"),  # ✅ Added missing endpoint
    path("products/analyze-product/", analyze_reviews, name="analyze-product"),
    path("products/categorized-reviews/", categorize_reviews_view, name="categorized-reviews"),
    path("products/predict-buy/", predict_buy_product, name="predict-buy"),
    path("products/<int:product_id>/recommendation/", product_recommendation, name="product-recommendation"),
    path("feedback/submit/", submit_feedback, name="submit-feedback"),
    path("products/<int:product_id>/reviews/", get_real_and_fake_reviews, name="get_real_and_fake_reviews"),
]

