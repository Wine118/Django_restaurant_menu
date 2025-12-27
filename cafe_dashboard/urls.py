from django.urls import path
from .views import dashboard,complaints_partial

urlpatterns = [
    path('', dashboard, name='cafe_dashboard'),
    path("partial/", complaints_partial, name="complaints_partial"),
]