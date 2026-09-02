import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

const categoryIcons: { [key: string]: string } = {
  Food: '🍔',
  Travel: '🚕',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '💰',
};

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');

  const loadExpenses = async () => {
    try {
      const data = await AsyncStorage.getItem('expenses');

      if (data) {
        const parsedData: Expense[] = JSON.parse(data);
        setExpenses(parsedData);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.log('Failed to load expenses:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }, [expenses]);

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) {
      return 0;
    }

    return totalExpense / expenses.length;
  }, [expenses, totalExpense]);

  const categoryTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      if (totals[expense.category]) {
        totals[expense.category] += expense.amount;
      } else {
        totals[expense.category] = expense.amount;
      }
    });

    return Object.entries(totals).sort(
      (a, b) => b[1] - a[1]
    );
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query.length === 0) {
      return expenses;
    }

    return expenses.filter((expense) => {
      return (
        expense.title.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    });
  }, [expenses, search]);

  const deleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter(
        (expense) => expense.id !== id
      );

      await AsyncStorage.setItem(
        'expenses',
        JSON.stringify(updatedExpenses)
      );

      setExpenses(updatedExpenses);
    } catch (error) {
      console.log('Failed to delete expense:', error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(id),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Spendly</Text>

          <Text style={styles.subtitle}>
            Manage your money smarter
          </Text>
        </View>

        <View style={styles.profile}>
          <Text style={styles.profileText}>S</Text>
        </View>
      </View>

      {/* Total Spending */}
      <View style={styles.mainCard}>
        <View style={styles.cardTop}>
          <Text style={styles.cardLabel}>
            Total Spending
          </Text>

          <Text style={styles.rupeeIcon}>₹</Text>
        </View>

        <Text style={styles.totalAmount}>
          ₹{totalExpense.toLocaleString('en-IN')}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              Transactions
            </Text>

            <Text style={styles.statValue}>
              {expenses.length}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              Average
            </Text>

            <Text style={styles.statValue}>
              ₹{Math.round(averageExpense).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </View>

      {/* Add Expense */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => router.push('/add-expense')}
      >
        <Text style={styles.plus}>+</Text>

        <Text style={styles.addButtonText}>
          Add Expense
        </Text>
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor="#999999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      {categoryTotals.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Spending by Category
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoryTotals.map(([category, amount]) => (
              <View
                key={category}
                style={styles.categoryCard}
              >
                <View style={styles.categoryIconBox}>
                  <Text style={styles.categoryIcon}>
                    {categoryIcons[category] || '💰'}
                  </Text>
                </View>

                <Text
                  style={styles.categoryName}
                  numberOfLines={1}
                >
                  {category}
                </Text>

                <Text style={styles.categoryAmount}>
                  ₹{amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recent Expenses */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Recent Expenses
        </Text>

        {expenses.length > 0 && (
          <Text style={styles.itemsText}>
            {filteredExpenses.length} items
          </Text>
        )}
      </View>

      {filteredExpenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            💸
          </Text>

          <Text style={styles.emptyTitle}>
            {search.length > 0
              ? 'No expenses found'
              : 'No expenses yet'}
          </Text>

          <Text style={styles.emptyText}>
            {search.length > 0
              ? 'Try another search.'
              : 'Add your first expense to start tracking your spending.'}
          </Text>
        </View>
      ) : (
        <View style={styles.expenseList}>
          {filteredExpenses.map((expense) => (
            <View
              key={expense.id}
              style={styles.expenseCard}
            >
              {/* Icon */}
              <View style={styles.expenseIconBox}>
                <Text style={styles.expenseIcon}>
                  {categoryIcons[expense.category] || '💰'}
                </Text>
              </View>

              {/* Information */}
              <View style={styles.expenseInfo}>
                <Text
                  style={styles.expenseTitle}
                  numberOfLines={1}
                >
                  {expense.title}
                </Text>

                <Text style={styles.expenseMeta}>
                  {expense.category} • {expense.date}
                </Text>
              </View>

              {/* Amount */}
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>
                  ₹{expense.amount.toLocaleString('en-IN')}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    confirmDelete(expense.id)
                  }
                >
                  <Text style={styles.deleteText}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  container: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 55,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111111',
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 5,
  },

  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  mainCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    marginTop: 28,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardLabel: {
    color: '#AAAAAA',
    fontSize: 15,
    fontWeight: '600',
  },

  rupeeIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  totalAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    marginTop: 12,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 25,
  },

  statBox: {
    marginRight: 55,
  },

  statLabel: {
    color: '#999999',
    fontSize: 12,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },

  addButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#111111',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plus: {
    color: '#FFFFFF',
    fontSize: 25,
    marginRight: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  searchBox: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginTop: 18,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  itemsText: {
    fontSize: 13,
    color: '#888888',
  },

  categoryScroll: {
    paddingRight: 10,
  },

  categoryCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginRight: 12,
  },

  categoryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryIcon: {
    fontSize: 21,
  },

  categoryName: {
    fontSize: 13,
    color: '#777777',
    fontWeight: '600',
    marginTop: 10,
  },

  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginTop: 5,
  },

  expenseList: {
    width: '100%',
  },

  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  expenseIconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F1F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  expenseIcon: {
    fontSize: 21,
  },

  expenseInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  expenseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },

  expenseMeta: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },

  expenseRight: {
    alignItems: 'flex-end',
  },

  expenseAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },

  deleteText: {
    fontSize: 11,
    color: '#D00000',
    marginTop: 5,
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },

  emptyText: {
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },

  bottomSpace: {
    height: 50,
  },
});