from django.db import models
from menu.models import Dish

# Create your models here.
class SpecialDish(models.Model):
    dish = models.ForeignKey(
        Dish,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_constraint=True,
    )

    name = models.CharField(max_length=200)
    burmese_name = models.CharField(max_length=200, null=True, blank=True)
    price = models.IntegerField()
    image1 = models.ImageField(upload_to="special/")
    image2 = models.ImageField(upload_to="special/", null=True, blank=True)
    image3 = models.ImageField(upload_to="special/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)