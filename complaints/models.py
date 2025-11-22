from django.db import models

# Create your models here.
class CustomerComplaint(models.Model):
    SERIOUS_LEVEL_CHOICES = [
        ('LOW','Low'),
        ('NORMAL','Normal'),
        ('HIGH','High'),
        ('CRITICAL','Critical'),
    ]

    customer_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    message = models.TextField()
    read = models.BooleanField(default=False)
    serious_level = models.CharField(
        max_length = 20,
        choices = SERIOUS_LEVEL_CHOICES,
        default = 'NORMAL'
    )

    created_at = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f"{self.customer_name} - {self.serious_level}"