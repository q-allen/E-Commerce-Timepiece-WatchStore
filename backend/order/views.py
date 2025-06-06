from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Order, OrderItem
from cart.models import Cart
from products.models import Product
from .serializers import OrderSerializer

class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
      
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
       
        user = request.user
        contact = request.data.get("contact")
        address = request.data.get("address")
        payment_method = request.data.get("payment_method")
        cart_items = request.data.get("cart_items")

        if not contact or not address or not cart_items:
            return Response({"error": "Missing contact, address, or cart items"}, status=status.HTTP_400_BAD_REQUEST)

       
        total_price = sum(item["total_price"] for item in cart_items)

       
        order = Order.objects.create(
            user=user,
            contact=contact,
            address=address,
            payment_method=payment_method,
            total_price=total_price
        )

      
        for item in cart_items:
            product = Product.objects.get(id=item["id"])
            OrderItem.objects.create(order=order, product=product, quantity=item["quantity"], price=item["total_price"])

       
        Cart.objects.filter(user=user).delete()

        return Response(OrderSerializer(order, context={"request": request}).data, status=status.HTTP_201_CREATED)
