from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length = 100)

    class Meta:
        db_table = 'category'
        managed = False

    def __str__(self):
        return self.name

class Dish(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.DO_NOTHING,
        db_column = 'category_id',
        related_name = 'dishes'
    )

    name = models.CharField(max_length = 200)
    burmese_name = models.CharField(max_length=200, blank=True)
    price = models.IntegerField()
    image_path = models.CharField(max_length=255)
    has_options = models.BooleanField(default=False)

    class Meta:
        db_table = 'dish'
        managed = False

    def __str__(self):
        return self.name


class Order(models.Model):
    DELIVERY_CHOICES = [
        ("delivery","Delivery"),
        ("takeout","Takeout"),
    ]

    customer_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=30)
    address = models.TextField(blank=True)

    delivery_type = models.CharField(
        max_length = 10,
        choices = DELIVERY_CHOICES
    )

    total_amount = models.IntegerField()
    amount_paid = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    # New fields
    processed = models.BooleanField(default=False)
    phoned_delivered = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name = "items",
        on_delete = models.CASCADE
    )

    dish_name = models.CharField(max_length=100)
    price = models.IntegerField()
    quantity = models.IntegerField()

    @property
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.dish_name} x {self.quantity}"