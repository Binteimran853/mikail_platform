from rest_framework import serializers
from .models import Order, OrderItem
from django.contrib.auth.models import User
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['user', 'total_price', 'status', 'items']



