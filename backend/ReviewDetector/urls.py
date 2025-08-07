from django.urls import path
from .views import classify_review

urlpatterns = [
    path("review/", classify_review),
]
