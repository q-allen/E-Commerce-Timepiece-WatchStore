from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'slug']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'price', 'stock', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'category']
    search_fields = ['name', 'description']
