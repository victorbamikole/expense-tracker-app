import axios from "axios";

const BASE_URL =
  "https://react-native-project-d4358-default-rtdb.firebaseio.com";

export async function storeExpense(expeseData) {
  const response = await axios.post(BASE_URL + "/expenses.json", expeseData);
  const id = response.data.name;
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(BASE_URL + "/expenses.json");

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }

  return expenses;
}

export function updatedExpense(id, expenseData) {
    return axios.put(BASE_URL + `/expenses/${id}.json`, expenseData);
}
export function deleteExpense(id) {
    return axios.delete(BASE_URL + `/expenses/${id}.json`);
}

export default storeExpense;
