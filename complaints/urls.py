from django.urls import path
from . import views

urlpatterns = [
    path('contact/', views.contact, name='contact'),
    path("send-complaint/", views.save_complaint,
    name="send_complaint"),
    path("success/",views.complaint_success,
    name="complaint_success"),
]
