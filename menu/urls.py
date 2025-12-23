from django.urls import path
from .views import menu_view,order_view,create_order_api

urlpatterns = [
    path('', menu_view, name='menu'),
    path('order/',order_view,name='order'),
    path('api/orders/',create_order_api,name='create_order_api'),
]