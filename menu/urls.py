from django.urls import path
from .views import menu_view,order_view,create_order_api,toggle_processed,toggle_phoned

urlpatterns = [
    path('', menu_view, name='menu'),
    path('order/',order_view,name='order'),
    path('api/orders/',create_order_api,name='create_order_api'),
    path('toggle-processed/',toggle_processed,name='toggle_processed'),
    path('toggle-phoned/',toggle_phoned,name='toggle-phoned'),
]