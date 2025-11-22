from django.shortcuts import render, redirect
from .models import CustomerComplaint

# Create your views here.
def contact(request):
    return render(request, 'main/contact.html')

def save_complaint(request):
    if request.method == "POST":
        CustomerComplaint.objects.create(
            customer_name = request.POST.get("customer_name"),
            phone_number = request.POST.get("phone"),
            message = request.POST.get("message"),
            serious_level = "NORMAL", #you can change later
        )
        return redirect("complaint_success")
    return render(request, "main/contact.html")


def complaint_success(request):
    return render(request, "main/complaintsuccess.html")
