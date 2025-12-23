import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from .models import Category,Order, OrderItem
# Create your views here.

def menu_view(request):
    categories = Category.objects.prefetch_related('dishes').all()
    return render(request, 'menu/menu.html',{
        'categories' : categories
    })


def order_view(request):
    return render(request, 'menu/order.html')


def create_order_api(request):
    if request.method == "POST":
        data = json.loads(request.body)

        customer = data.get("customer",{})
        cart = data.get("cart",[])

        # Create Order
        order = Order.objects.create(
            customer_name = customer.get("name",""),
            phone = customer.get("phone",""),
            address = customer.get("address",""),
            delivery_type = data.get("delivery_type"),
            total_amount = data.get("total"),
            amount_paid = data.get("amount_paid"),
        )

        # create order items
        for item in cart:
            OrderItem.objects.create(
                order=order,
                dish_name = item.get("name"),
                price = item.get('price'),
                quantity = item.get('qty'),
            )
        print("ORDER RECEIVED: ",data)

        return JsonResponse({
            "status": "success",
            "order_id": order.id
        })

    return JsonResponse({"error":"POST only"}, status=405)
