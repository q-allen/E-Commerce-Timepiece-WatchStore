from django.urls import path
from .views import UserSignupAPIView, LoginView, UserDetailView

urlpatterns = [
    path('signup/', UserSignupAPIView.as_view(), name='user-signup'),
    path('login/', LoginView.as_view(), name='simple_login'),
    path("", UserDetailView.as_view(), name="user-detail")
]
