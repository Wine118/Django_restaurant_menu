from django.shortcuts import render 
from django.core.paginator import Paginator 
from complaints.models import CustomerComplaint
from menu.models import Order, Dish
from .models import SpecialDish
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

    suggestions = []
    seen_names = set() #KEY FIX
    
    # First: check SpecialDish table
    specials = SpecialDish.objects.filter(
        Q(name__icontains=q) | Q(burmese_name__icontains=q)
    )

    for special in specials:
        dish_name = special.dish.name if special.dish else special.name
        if dish_name in seen_names:
            continue   

        seen_names.add(dish_name)
        suggestions.append({
            "id": special.dish.id if special.dish else None,
            "name": special.name,
            "burmese_name": special.burmese_name,
            "price": special.price,
            "source":"special"
        })

        

    

     # Second: check Dish table
    dishes = Dish.objects.filter(
        Q(name__icontains=q) | Q(burmese_name__icontains=q)
    )
    
    for dish in dishes:
        if dish.name in seen_names:
            continue
        seen_names.add(dish.name)
        suggestions.append({
            "id": dish.id,
            "name": dish.name,
            "burmese_name": dish.burmese_name,
            "price": dish.price,
            "source":"menu"
        })
    return JsonResponse(suggestions, safe=False)    

    
        
    

@login_required
def upload_special(request):
    if request.method == "POST":
        name = request.POST.get("dishName")
        burmese_name = request.POST.get("dishBurmeseName")
        dish_id = request.POST.get("dishId")
        price = request.POST.get("price")
        images = request.FILES.getlist("images")       


        dish = None
        if dish_id:
            dish = Dish.objects.filter(id=dish_id).first()
            price = dish.price if dish else price

        # deactivate old special
        SpecialDish.objects.filter(active=True).update(active=False)
        
        special, created = SpecialDish.objects.get_or_create(name=name, defaults={
            "dish": dish,
            "name": name,
            "burmese_name": burmese_name,
            "price": price,
            "active": True,
            "image1": images[0] if len(images) > 0 else None,
            "image2": images[1] if len(images) > 1 else None,
            "image3": images[2] if len(images) > 2 else None,
        })

        if not created:
            if special.price == int(price): 
                # deactivate old special
                SpecialDish.objects.filter(active=True).update(active=False)
                special.active = True
                if len(images) > 0:
                    special.image1 = images[0]  
                    if len(images) > 1:
                        special.image2 = images[1]  
                        if len(images) > 2:
                         special.image3 = images[2]
                special.save() 
                return JsonResponse({"status":"success", "special name": special.name, "special price": special.price, "Is active": special.active},status=201)
            else: 
                special.price = int(price) 
                special.active = True
                 # Update images if new ones are provided   
                if len(images) > 0:
                    special.image1 = images[0]  
                    if len(images) > 1:
                        special.image2 = images[1]  
                        if len(images) > 2:
                         special.image3 = images[2]
                special.save() 
                return JsonResponse({"status":"success", "message":"Price is updated","special name": special.name, "special price": special.price, "Is active": special.active},status=201)


        # special = SpecialDish.objects.create(
        #     dish=dish,
        #     name=name,
        #     burmese_name=burmese_name,
        #     price=price,
        #     image1=images[0] if len(images) > 0 else None,
        #     image2=images[1] if len(images) > 1 else None,
        #     image3=images[2] if len(images) > 2 else None,
        # )

        
        return JsonResponse({
            "status":"success",
            "special_id": special.id,
            "special_name": special.name,
            "special_burmese_name": special.burmese_name,
            "special_price": special.price,
            "image1": special.image1.url if special.image1 else None
        }, status=201)


def latest_special(request):
    special = SpecialDish.objects.filter(active=True).first()


    if not special:
        return JsonResponse({"exists": False})

    data = {
        "exists": True,
        "name": special.burmese_name or special.name,
        "images": [
            special.image1.url if special.image1 else None,
            special.image2.url if special.image2 else None,
            special.image3.url if special.image3 else None,
        ]
    }
    return JsonResponse(data)