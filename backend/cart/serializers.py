from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_image = serializers.SerializerMethodField()  # ✅ Fix image path
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ["id", "user", "product", "product_name", "product_image", "quantity", "total_price", "added_at"]

    def get_product_image(self, obj):
      
        request = self.context.get("request") 
        if request and obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return obj.product.image.url if obj.product.image else None