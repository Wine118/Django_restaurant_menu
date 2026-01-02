from django.shortcuts import render 
from django.core.paginator import Paginator 
from complaints.models import CustomerComplaint
from menu.models import Order, Dish
from django.utils import timezone
from datetime import datetime, time
from django.contrib.auth.decorators import login_required 
from django.http import JsonResponse
from django.db.models import Q



# Create your views here.
@login_required
def admin_dashboard(request):
    return render(request, "cafe_dashboard/admin_dashboard.html")


@login_required
def admin_complaints(request):
    complaints_qs = CustomerComplaint.objects.all()
    selected_date = request.GET.get("date")

    if selected_date:
        
        selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
        start = timezone.make_aware(datetime.combine(selected_date, time.min))
        end = timezone.make_aware(datetime.combine(selected_date, time.max))

        complaints_qs = complaints_qs.filter(created_at__range=(start, end))

    complaints_qs = complaints_qs.order_by("-created_at")

    paginator = Paginator(complaints_qs, 10)
    page_obj = paginator.get_page(request.GET.get("page"))

    return render(
        request,
        "cafe_dashboard/admin_complaints.html",
        {
            "complaints": page_obj,
            "selected_date": request.GET.get("date"),
        }
    )


@login_required
def admin_orders(request):
    orders_qs = Order.objects.prefetch_related("items")

    selected_date = request.GET.get("date")

    if selected_date:
        # Selected specific day
        selected_date = datetime.strptime(selected_date, "%Y-%m-%d").date()
    else:
        # Default -> today
        selected_date = timezone.localdate()

    start = timezone.make_aware(datetime.combine(selected_date, time.min))
    end = timezone.make_aware(datetime.combine(selected_date, time.max))
    # only orders from that day
    orders_qs = orders_qs.filter(created_at__range=(start, end)) 
    
    

    # Newest first
    orders_qs = orders_qs.order_by("-created_at")

    paginator = Paginator(orders_qs, 10)
    page_obj = paginator.get_page(request.GET.get("page"))


    return render(
        request,
        "cafe_dashboard/admin_orders.html",
        {
            "orders":page_obj,
            "selected_date":selected_date.strftime("%Y-%m-%d"),
        
        }
    )


def dish_suggestions(request):
    q = request.GET.get("q","").strip()
    if not q:
        return JsonResponse([], safe=False)

    dishes = Dish.objects.filter(
        Q(name__icontains=q) | Q(burmese_name__icontains=q)
    )[:10]
    # Send both id, name and burmese_name
    data = [
        {
            "id": dish.id,
            "name": dish.name,
            "burmese_name": dish.burmese_name
        } for dish in dishes
    ]
    return JsonResponse(
        data
        ,safe=False
    )