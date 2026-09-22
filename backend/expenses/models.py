from django.db import models
from django.contrib.auth.models import User


class Expense(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    category = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    amount = models.FloatField()
    date = models.DateField()
    payment_method = models.CharField(max_length=50)

    def __str__(self):
        return self.description


class Income(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    month = models.IntegerField()
    year = models.IntegerField()
    amount = models.FloatField()

    def __str__(self):
        return f"{self.month}/{self.year} - {self.amount}"