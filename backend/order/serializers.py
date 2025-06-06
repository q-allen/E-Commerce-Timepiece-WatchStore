from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_image = serializers.ReadOnlyField(source="product.image.url")

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "product_image", "quantity", "price"]
        
        def get_product_image(self, obj):
            """Ensure product image has a full URL"""
            request = self.context.get("request")
            if obj.product.image:
                return request.build_absolute_uri(obj.product.image.url) if request else obj.product.image.url
            return None  # ✅ Return None if no image exists

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "contact", "address", "payment_method", "total_price", "status", "created_at", "items"]
