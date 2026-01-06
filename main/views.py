from django.shortcuts import render
from cafe_dashboard.models import SpecialDish

def index(request):
    special = SpecialDish.objects.filter(active=True).order_by('-created_at').first()
    return render(
        request, 
        'main/index.html',
        {
            'special': special,
        })


def about(request):
    return render(request, 'main/about.html')
