from django.contrib import admin
from .models import CustomerComplaint
# Register your models here.
class MemberAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'phone_number', 'serious_level', 'read', 'created_at')
    list_filter = ('serious_level', 'read', 'created_at')
    search_fields = ('customer_name', 'phone_number', 'message')
    ordering = ('-created_at',)

admin.site.register(CustomerComplaint,MemberAdmin)
