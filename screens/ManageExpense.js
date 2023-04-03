import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Button from "../components/ExpensesOutput/Ui/Button";
import IconButton from "../components/ExpensesOutput/Ui/IconButton";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../store/Expenses-Context";
import storeExpense, {
  deleteExpense,
  deleteExpenses,
  updatedExpense,
} from "../utils/http";
import LoadingOverlay from "../components/ExpensesOutput/Ui/LoadingOverlay";
import ErrorOverlay from "../components/ExpensesOutput/Ui/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const expensesCtx = useContext(ExpensesContext);
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const [error, setError] = useState();

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("could not delete expenses");
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updatedExpense(editedExpenseId, expenseData);
        expensesCtx.updateExpense(editedExpenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("could not save data - please try again later!");
      setIsSubmitting(false);
    }
  }


  if (error && !isSubmiting) {
    return <ErrorOverlay message={error}  />;
  }

  if (isSubmiting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onSubmit={confirmHandler}
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
