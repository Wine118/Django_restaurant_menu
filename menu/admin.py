from django.contrib import admin
from .models import Order, OrderItem

# Inline display of OrderItems inside each Order pag
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # don't show empty extra rows
    fields = ("dish_name","price","quantity") # columns to display

# Custom admin for Order
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "phone",
        "address",
        "delivery_type",
        "total_amount",
        "amount_paid",
        "created_at"
    )

    search_fields = ("customer_name","phone") #quick search
    list_filter = ("delivery_type", "created_at") #sidebar filters
    inlines = [OrderItemInline]  #show items inside order detail page


# Custom admin for OrderItem
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "dish_name",
        "price",
        "quantity",
    )

    search_fields = ("dish_name",)
    list_filter = ("order",)