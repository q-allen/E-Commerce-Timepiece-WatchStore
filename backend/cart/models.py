from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product 


User = get_user_model()

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")  
    product = models.ForeignKey(Product, on_delete=models.CASCADE) 
    quantity = models.PositiveIntegerField(default=1)  
    added_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"

    @property
    def total_price(self):
        """Calculate total price for this cart item."""
        return self.product.price * self.quantity
