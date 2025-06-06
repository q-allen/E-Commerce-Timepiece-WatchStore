from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSignupSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name="dispatch")  # Disable CSRF for API
class UserSignupAPIView(APIView):
    def post(self, request):
        print("Incoming Data:", request.data)  # Debugging

        serializer = UserSignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

        print("Validation Errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

# login process
class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=200)  # Return only token

        return Response(serializer.errors, status=400) 
    
class UserDetailView(APIView):
    authentication_classes = [JWTAuthentication]  # Explicitly require JWT
        # permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_authenticated:  # ✅ Prevent serialization of AnonymousUser
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
         
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data, status=200)