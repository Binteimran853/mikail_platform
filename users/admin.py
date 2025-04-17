from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User,Order,Offer,OrderItem,SentOrderItem

class CustomUserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('is_buyer', 'is_supplier')}),
    )
    list_display = ('username', 'email', 'is_buyer', 'is_supplier', 'is_staff', 'is_superuser')
    list_filter = ('is_buyer', 'is_supplier', 'is_staff')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(SentOrderItem)
admin.site.register(Offer)


