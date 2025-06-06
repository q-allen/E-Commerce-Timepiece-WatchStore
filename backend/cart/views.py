from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Cart
from .serializers import CartSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        cart_items = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(cart_items, many=True, context={"request": request})  # ✅ Pass request
        return Response(serializer.data)

    def post(self, request):
    
        user = request.user
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)

        cart_item, created = Cart.objects.get_or_create(user=user, product_id=product_id)

        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
     
        cart_item_id = request.data.get("cart_item_id")
        try:
            cart_item = Cart.objects.get(id=cart_item_id, user=request.user)
            cart_item.delete()
            return Response({"message": "Item removed from cart."}, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request):
       
        cart_item_id = request.data.get("cart_item_id")
        new_quantity = request.data.get("quantity")

        if not cart_item_id or not new_quantity:
            return Response({"error": "Missing cart_item_id or quantity"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = Cart.objects.get(id=cart_item_id, user=request.user)
            cart_item.quantity = new_quantity
            cart_item.save()

            serializer = CartSerializer(cart_item, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
