import { useState,useEffect } from "react"
import Login  from "./Login"
import { PieChart, Pie,Cell, Tooltip, Legend } from "recharts"
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("access_token")
)
function handleLogout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  setIsLoggedIn(false)
}

  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [month, setMonth] = useState(8)
  const [year, setYear] = useState(2026)

  const [expenses, setExpenses] = useState([])
  const [searchText, setSearchText] = useState("")
useEffect(() => {

  if (!isLoggedIn) {
    return
  }

  fetch("http://127.0.0.1:8000/api/expenses/", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      setExpenses(data)
    })
    .catch((error) => {
      console.log("Error fetching expenses:", error)
    })

}, [isLoggedIn])
useEffect(() => {
  if (!isLoggedIn){
    return
  }
  fetch("http://127.0.0.1:8000/api/income/", {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
  }
})
    .then((response) => response.json())
    .then((data) => {
      const currentIncome = data.find((item) => {
        return (
          Number(item.month) === Number(month) &&
          Number(item.year) === Number(year)
        )
      })

      if (currentIncome) {
        setIncome(currentIncome.amount)
      } else {
        setIncome(0)
      }
    })
    .catch((error) => {
      console.log("Error fetching income:", error)
    })
}, [month, year, isLoggedIn])
  const filteredExpenses = expenses
  .filter((expense) => {
    const expenseDate = new Date(expense.date)

    const matchesMonth =
      expenseDate.getMonth() === month &&
      expenseDate.getFullYear() === year

    const matchesSearch =
      expense.description
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      expense.category
        .toLowerCase()
        .includes(searchText.toLowerCase())

    return matchesMonth && matchesSearch
  })
  .sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })


  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

  const [income, setIncome] = useState(0)

  const remainingBalance = income - totalExpenses
  const savingsPercentage =
  income > 0 ? (remainingBalance / income) * 100 : 0

const categoryTotals = {}

filteredExpenses.forEach((expense) => {
  if (categoryTotals[expense.category]) {
    categoryTotals[expense.category] += expense.amount
  } else {
    categoryTotals[expense.category] = expense.amount
  }
})

let highestCategory = ""
let highestAmount = 0

Object.keys(categoryTotals).forEach((category) => {
  if (categoryTotals[category] > highestAmount) {
    highestAmount = categoryTotals[category]
    highestCategory = category
  }
})

const chartData = Object.keys(categoryTotals).map((category) => ({
  name: category,
  value: categoryTotals[category]
}))

  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  function previousMonth() {

  if (month === 0) {
    setMonth(11)
    setYear(year - 1)
  } else {
    setMonth(month - 1)
  }
}

function nextMonth() {

  if (month === 11) {
    setMonth(0)
    setYear(year + 1)
  } else {
    setMonth(month + 1)
  }
}

  function editExpense(expense) {
  setAmount(expense.amount)
  setCategory(expense.category)
  setDescription(expense.description)
  setDate(expense.date)
  setPaymentMethod(expense.payment_method)

  setEditingExpense(expense)
  setShowForm(true)
}
  async function saveIncome() {
  const incomeData = {
    month: month,
    year: year,
    amount: income
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/income/",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("access_token")}`
},
        body: JSON.stringify(incomeData)
      }
    )

    if (!response.ok) {
      alert("Failed to save income")
      return
    }

    const savedIncome = await response.json()

    setIncome(savedIncome.amount)

    alert("Income saved successfully")
  } catch (error) {
    console.log("Error saving income:", error)
  }
}
  async function addExpense() {
  if (amount === "" || description === "" || date === "") {
    alert("Please fill all required fields")
    return
  }

  if (Number(amount) <= 0) {
    alert("Amount must be greater than 0")
    return
  }

  const expenseData = {
    category: category,
    description: description,
    amount: Number(amount),
    date: date,
    payment_method: paymentMethod
  }

  try {
    let response

    if (editingExpense !== null) {
      response = await fetch(
        `http://127.0.0.1:8000/api/expenses/${editingExpense.id}/`,
        {
          method: "PUT",
          headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("access_token")}`
},
          body: JSON.stringify(expenseData)
        }
      )
    } else {
  response = await fetch(
    "http://127.0.0.1:8000/api/expenses/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
          body: JSON.stringify(expenseData)
        }
      )
    }

    if (!response.ok) {
      alert("Something went wrong")
      return
    }

    const savedExpense = await response.json()

    if (editingExpense !== null) {
      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === editingExpense.id) {
          return savedExpense
        }

        return expense
      })

      setExpenses(updatedExpenses)
    } else {
      setExpenses([...expenses, savedExpense])
    }

    setAmount("")
    setCategory("Food")
    setDescription("")
    setDate("")
    setPaymentMethod("UPI")
    setEditingExpense(null)
    setShowForm(false)

    alert(
      editingExpense !== null
        ? "Expense updated successfully"
        : "Expense added successfully"
    )

  } catch (error) {
    console.log("Error saving expense:", error)
  }
}
  async function deleteExpense(id) {
    const confirmDelete = window.confirm(
  "Are you sure you want to delete this expense?"
)

if (!confirmDelete) {
  return
}
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/expenses/${id}/`,
      {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
  }
}
    )

    if (!response.ok) {
      alert("Failed to delete expense")
      return
    }

    const updatedExpenses = expenses.filter((expense) => {
      return expense.id !== id
    })

    setExpenses(updatedExpenses)

    alert("Expense deleted successfully")
  } catch (error) {
    console.log("Error deleting expense:", error)
  }
}

  
  const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
  if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />
}
  return (
    <div className="app">

      <header>
  <div>
    <h1>Monthly Expense Tracker</h1>
    <p>Track your money and control your spending.</p>
  </div>

  <div>
    <button onClick={() => setShowForm(true)}>
      + Add Expense
    </button>

    <button onClick={handleLogout}>
      Logout
    </button>
  </div>
</header>

      <div className="month">

  <button onClick={previousMonth}>←</button>

  <h2>
    {monthNames[month]} {year}
  </h2>

  <button onClick={nextMonth}>→</button>

</div>

      <div className="summary">

       <div className="card">
  <p>Total Income</p>

  <input
    type="number"
    value={income}
    onChange={(e) => setIncome(Number(e.target.value))}
  />

  <button onClick={saveIncome}>
    Save Income
  </button>
</div>

        <div className="card">
          <p>Total Expenses</p>
          <h2>₹{totalExpenses}</h2>
        </div>

        <div className="card">
          <p>Remaining Balance</p>
          <h2>₹{remainingBalance}</h2>
        </div>
        <div className="card">
  <p>Savings</p>
  <h2>{savingsPercentage.toFixed(1)}%</h2>
</div>
        <div className="card">
          <p>Highest Spending</p>
          <h2>{highestCategory}</h2>
          <p>₹{highestAmount}</p>
        </div>
      </div>
      <section>
  <h2>Category Breakdown</h2>

  {Object.keys(categoryTotals).map((category) => (
    <div className="expense" key={category}>
      <h3>{category}</h3>
      <strong>₹{categoryTotals[category]}</strong>
    </div>
  ))}
  <PieChart width={400} height={300}>
  <Pie
    data={chartData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label
  />

  <Tooltip />
  <Legend />
</PieChart>
</section>
      <section>
  <h2>Recent Expenses</h2>

  <input
    type="text"
    placeholder="Search expenses..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

        {filteredExpenses.length === 0 ? (
  <p className="empty-message">
  {searchText
    ? "No expenses found for your search."
    : "No expenses recorded for this month."}
</p>
) : (
  filteredExpenses.map((expense, index) => (
    <div className="expense" key={index}>
      <div>
        <h3>{expense.category}</h3>
        <p>{expense.description}</p>
        <p>{expense.payment_method} • {expense.date}</p>
      </div>

      <button onClick={() => editExpense(expense)}>
        Edit
      </button>

      <div>
        <strong>₹{expense.amount}</strong>

        <button onClick={() => deleteExpense(expense.id)}>
          Delete
        </button>
      </div>
    </div>
  ))
)}

       

      </section>

      {showForm && (
        <div className="form-box">

          <h2>
  {editingExpense !== null ? "Edit Expense" : "Add Expense"}
</h2>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Education</option>
            <option>Gym</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option>UPI</option>
  <option>Cash</option>
  <option>Card</option>
  <option>Bank Transfer</option>
</select>

          <div className="form-buttons">

            <button onClick={addExpense}>
  {editingExpense !== null ? "Update Expense" : "Add Expense"}
</button>

            <button onClick={() => {
  setShowForm(false)
  setEditingExpense(null)
}}
>
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default App