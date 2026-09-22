from django.urls import path
from .views import expense_list, expense_detail, income_list

urlpatterns = [
    path("expenses/", expense_list),
    path("expenses/<int:id>/", expense_detail),
    path("income/", income_list),
]