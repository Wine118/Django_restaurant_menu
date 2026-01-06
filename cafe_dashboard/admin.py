from django.contrib import admin
from .models import SpecialDish

# Register your models here.

@admin.register(SpecialDish)
class SpecialDishAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "burmese_name",
        "price",
        "active",
        "dish",
        "created_at",
    )
    list_filter = ("active", "created_at")
    search_fields = ("name", "burmese_name")
    ordering = ("-created_at",)
