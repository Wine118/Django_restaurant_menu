import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
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


 
@require_POST
def toggle_processed(request):
    data = json.loads(request.body)
    order = get_object_or_404(Order, id=data.get("id"))
    order.processed = data.get("processed", False)
    order.save()
    return JsonResponse({"status":"ok","processed":order.processed})


@require_POST
def toggle_phoned(request):
    data = json.loads(request.body)
    order = get_object_or_404(Order, id=data.get("id"))
    order.phoned_delivered = data.get("phoned",False)
    order.save()
    return JsonResponse({"status":"ok","phoned":order.phoned_delivered})