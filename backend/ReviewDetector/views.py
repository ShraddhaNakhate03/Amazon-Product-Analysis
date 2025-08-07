from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
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

@api_view(["POST"])
def classify_review(request):
    review_text = request.data.get("review", "")
    if not review_text:
        return Response({"error": "Review text is required"}, status=400)

    cleaned_review = clean_text(review_text)
    transformed_review = vectorizer.transform([cleaned_review])
    prediction = svm_model.predict(transformed_review)

    return Response({"review": review_text, "prediction": "Real" if prediction == 1 else "Fake"})
