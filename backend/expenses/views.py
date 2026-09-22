from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Expense, Income
from .serializers import ExpenseSerializer, IncomeSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def expense_list(request):

    if request.method == "GET":
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ExpenseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def expense_detail(request, id):

    try:
        expense = Expense.objects.get(
            id=id,
            user=request.user
        )
    except Expense.DoesNotExist:
        return Response(
            {"error": "Expense not found"},
            status=404
        )

    if request.method == "GET":
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = ExpenseSerializer(
            expense,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors)

    if request.method == "DELETE":
        expense.delete()
        return Response({"message": "Expense deleted"})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def income_list(request):

    if request.method == "GET":
        incomes = Income.objects.filter(user=request.user)
        serializer = IncomeSerializer(incomes, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        month = request.data.get("month")
        year = request.data.get("year")
        amount = request.data.get("amount")

        income = Income.objects.filter(
            user=request.user,
            month=month,
            year=year
        ).first()

        if income:
            income.amount = amount
            income.save()

            serializer = IncomeSerializer(income)
            return Response(serializer.data)

        serializer = IncomeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors)