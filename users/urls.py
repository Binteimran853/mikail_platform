from django.urls import path
from .views import RegisterAPIView, LoginAPIView, APIRootView,LogOutAPIView





from .views import( CreateOrderAPIView, OfferOrderAPIView, ConfirmOrderAPIView,OrderAPIView,OrderSendSupplier,GetOrders,
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogOutAPIView.as_view(), name='login'),

    path('', APIRootView.as_view(), name='api-root'),




    path('orders/', CreateOrderAPIView.as_view(), name='create-order'),
    path('order-send-suppliers/',OrderSendSupplier.as_view(),name='order-to-supplier'),
    path('notificationOrders/',GetOrders.as_view(),name='get-orders'),
    path('orders/<int:order_id>/offers/', OfferOrderAPIView.as_view(), name='submit-offer'),
    path('orders/<int:order_id>/confirm/', ConfirmOrderAPIView.as_view(), name='confirm-order'),
]
