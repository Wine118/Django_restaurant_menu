from django.urls import path
from .views import contact,save_complaint,complaint_success,toggle_read

urlpatterns = [
    path('contact/', contact, name='contact'),
    path("send-complaint/", save_complaint, name="send_complaint"),
    path("success/", complaint_success,name="complaint_success"),
    path("toggle-read/", toggle_read, name= "toggle_read"),
]
