from django.shortcuts import render 
from django.core.paginator import Paginator 
from complaints.models import CustomerComplaint
from datetime import datetime
from django.contrib.auth.decorators import login_required  

# Create your views here.
@login_required
def dashboard(request):
    complaints = CustomerComplaint.objects.all().order_by('-created_at')
    
    # Date filter (from calendar input)
    selected_date = request.GET.get('date')
    if selected_date:
        complaints = complaints.filter(
            created_at__date = selected_date
        )

    # Pagination (20 per page)
    paginator = Paginator(complaints, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    

    context = {
        'complaints' : page_obj,
        'selected_date' : selected_date
    }
    return render(request, 'cafe_dashboard/admin.html',context)