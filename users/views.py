
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from .models import Order, OrderItem, Offer,SentOrderItem
from .serializers import OrderSerializer,OfferSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from collections import defaultdict
from django.db.models import Q
User = get_user_model()

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role')  # 'buyer' or 'supplier'

        if User.objects.filter(username=username).exists():
            raise ValidationError({"username": "This username is already taken."})

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            if role == 'buyer':
                user.is_buyer = True
            elif role == 'supplier':
                user.is_supplier = True
            user.save()

            # Return user details in response
            return Response({
                "message": "User created successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": role,
                    
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(
            Q(username=username_or_email) | Q(email=username_or_email)
        ).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': 'buyer' if getattr(user, 'is_buyer', False) else 'supplier' if getattr(user, 'is_supplier', False) else 'unknown',
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)

        return Response({
            'message': 'Invalid username or password'
        }, status=status.HTTP_401_UNAUTHORIZED)



# log out functionality
class LogOutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # Do nothing on server, just confirm logout
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

class APIRootView(APIView):
    def get(self, request):
        # Return a simple message or list of available endpoints
        return Response({
            "message": "Welcome to the Mikail Platform API",
            "endpoints": {
                "register": "/api/register/",
                "login": "/api/login/",
            }
        })
    

class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        buyer = request.user
        items = request.data.get('items')
        total_price = request.data.get('total_price')
        print(buyer.email,buyer.password,items,total_price)
        if not items:
            return Response({'error': 'Items are required.'}, status=400)

        # Create order
        order = Order.objects.create(
            buyer=buyer,
            total_price=total_price,
            status='pending'
        )
        print(order)
        # # Create order items
        for item in items:
            OrderItem.objects.create(
            order=order,
            item_name=item.get('name'),              # ✅ use item_name instead of name
            quantity=item.get('quantity'),
            supplier_price=item.get('price')         # ✅ use supplier_price instead of price
        )

        print('OrderItems: ',OrderItem.objects.all().values())
        return Response({"message": "Order created successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)

    

class OrderSendSupplier(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        buyer = request.user
        print("buyer_id: ",buyer.id)
        buyer_id = buyer.id  
        # # Get the latest order
        latest_order = Order.objects.latest('id')
        print(f"Latest Order: {latest_order}")

        # # Get all order items from the latest order
        order_items = OrderItem.objects.filter(order=latest_order)
        print(f"Order Items: {order_items}")
        # # Get all suppliers
        suppliers = User.objects.filter(is_supplier=True)
        if not suppliers.exists():
            return Response({'error': 'No suppliers found.'}, status=404)
        print(f"Suppliers: {suppliers}")
 
        # # Create SentOrderItem entries for each supplier and order item
        for supplier in suppliers:
            for item in order_items:
                SentOrderItem.objects.create(
                    supplier=supplier,
                    order_item=item,
                    buyer=buyer
                    
                )

        return Response({
            'message': 'Order sent to all suppliers!',
            'buyer_id': buyer_id  # send it to the frontend
        }, status=status.HTTP_200_OK)
# get orders on suppliers profile
class GetOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,buyer_id,order_id):
        supplier = request.user
        print('supplier id: ',supplier,'buyer_id: ',buyer_id)
        # Only get SentOrderItems for this supplier
        sent_items = SentOrderItem.objects.filter(
            supplier=supplier, buyer__id=buyer_id
        ).select_related('supplier', 'order_item__order', 'buyer')

        if not sent_items.exists():
            return Response({'message': 'No Orders Yet!'}, status=status.HTTP_200_OK)

        grouped_orders = defaultdict(lambda: {
            'order_id': None,
            'buyer_id': None,
            'buyer_username': '',
            'order_status': '',
            'order_total_price': 0,
            'sent_at': '',
            'items': [],
        })

        for item in sent_items:
            order_id = item.order_item.order.id
            grouped = grouped_orders[order_id]
            print(item.buyer.id)
            grouped.update({
                'order_id': order_id,
                'buyer_id': item.buyer.id,
                'order_status': item.order_item.order.status,
                'order_total_price': item.order_item.order.total_price,
                'sent_at': item.sent_at,
            })

            grouped['items'].append({
                'item_name': item.order_item.item_name,
                'quantity': item.order_item.quantity,
                'supplier_price': item.order_item.supplier_price,
                'item_total_price': item.order_item.quantity * item.order_item.supplier_price,
                'order_item_id': item.order_item.id,
                'supplier_username': item.supplier.username,
            })


        return Response({
            'message': 'Order details fetched successfully!',
            'orders': list(grouped_orders.values())
        }, status=status.HTTP_200_OK)


class OfferOrderAPIView(APIView):
    def post(self, request, order_id):
        # Supplier submits an offer for a specific order
    
        order = get_object_or_404(Order, id=order_id) #correct
        
        buyer= order.buyer

        supplier = request.user     #correct
        price = request.data.get('price')  #correct
        estimated_delivery_time = request.data.get('estimated_delivery_time') #correct
        print(buyer)
        # buyer=SentOrderItem.objects.filter(supplier=supplier).first().buyer
        # Create a new offer for the order
        # offer = Offer.objects.create(
        #     order=order,
        #     supplier=supplier,
        #     buyer=buyer,
        #     price=price,
        #     estimated_delivery_time=estimated_delivery_time,
        # )
        # # serialized_offer = OfferSerializer(offer)
        return Response({
            "message": "Offer submitted successfully",
            
        }, status=status.HTTP_201_CREATED)


class ConfirmOrderAPIView(APIView):
    def put(self, request, order_id):
        # Buyer confirms the order after receiving offers
        order = get_object_or_404(Order, id=order_id)
        best_offer = Offer.objects.filter(order=order).order_by('price').first()  # Get the best price offer

        if not best_offer:
            return Response({"message": "No offers available"}, status=status.HTTP_400_BAD_REQUEST)

        # Update the order to be confirmed and assign the supplier
        order.supplier = best_offer.supplier
        order.status = 'confirmed'
        order.save()

        return Response({"message": "Order confirmed successfully", "supplier": best_offer.supplier.username, "price": best_offer.price}, status=status.HTTP_200_OK)


class OrderAPIView(APIView):
    # Handles creation of an order
    def post(self, request):
        items = request.data.get('items')  # List of items added to cart by the buyer
        total_price = request.data.get('total_price')  # Total price of the order
        
        # Create the order
        order = Order.objects.create(buyer=request.user, total_price=total_price, status='pending')
        
        # Create order items
        for item in items:
            OrderItem.objects.create(
                order=order,
                item_name=item['name'],
                quantity=item['quantity']
            )
        
        return Response({"message": "Order created successfully!", "order_id": order.id}, status=status.HTTP_201_CREATED)
