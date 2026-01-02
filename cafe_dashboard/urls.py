from django.urls import path
from .views import admin_dashboard,admin_orders,admin_complaints,dish_suggestions

urlpatterns = [
    path('',admin_dashboard, name="cafe_dashboard"),
    path('cafeorders/', admin_orders, name="cafe_orders" ),
    path('cafecomplaints/', admin_complaints, name='cafe_complaints'),
    path('dish-suggestions/', dish_suggestions, name="dish_suggestions"),

]