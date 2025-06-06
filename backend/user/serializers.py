from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'middle_name', 'last_name', 'username', 
            'contact', 'address', 'gender', 'email', 'password', 'confirm_password'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password
        password = validated_data.pop('password')  # Extract password

        user = CustomUser.objects.create(**validated_data)  # Create user without password
        user.set_password(password)  # Hash password properly
        user.save()

        return user

class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        exclude = ('password',)

    def get_image(self, obj):
       
        request = self.context.get("request")

      
        if obj and hasattr(obj, "image") and obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url

        return None  
    
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

       
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return {"access": access_token}  