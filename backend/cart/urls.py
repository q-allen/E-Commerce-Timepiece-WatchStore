from django.urls import path
from .views import CartView  # ✅ Ensure this matches views.py

urlpatterns = [
    path("api/cart/", CartView.as_view(), name="cart"),
]
