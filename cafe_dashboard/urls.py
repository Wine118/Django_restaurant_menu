from django.urls import path
from .views import admin_dashboard,admin_orders,admin_complaints,dish_suggestions,upload_special,latest_special
from django.contrib.auth import views as auth_views



urlpatterns = [
    path('',admin_dashboard, name="cafe_dashboard"),
    path('cafeorders/', admin_orders, name="cafe_orders" ),
    path('cafecomplaints/', admin_complaints, name='cafe_complaints'),
    path('dish-suggestions/', dish_suggestions, name="dish_suggestions"),
    path('upload-special/', upload_special, name="upload_special"),
    path("latest-special/", latest_special, name="latest_special"),

    # Built-in logout view
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

]