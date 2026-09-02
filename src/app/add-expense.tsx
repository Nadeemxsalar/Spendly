import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { name: 'Food', icon: '🍔' },
  { name: 'Travel', icon: '🚕' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Bills', icon: '📄' },
  { name: 'Other', icon: '💰' },
];

type SavedExpense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [saving, setSaving] = useState(false);

  const saveExpense = async () => {
    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle) {
      Alert.alert(
        'Missing title',
        'Please enter an expense title.'
      );
      return;
    }

    if (!amount.trim()) {
      Alert.alert(
        'Missing amount',
        'Please enter the expense amount.'
      );
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid amount greater than 0.'
      );
      return;
    }

    try {
      setSaving(true);

      const savedData = await AsyncStorage.getItem('expenses');

      let expenses: SavedExpense[] = [];

      if (savedData) {
        expenses = JSON.parse(savedData);
      }

      const newExpense: SavedExpense = {
        id: Date.now().toString(),
        title: cleanTitle,
        amount: numericAmount,
        category,
        date: new Date().toLocaleDateString('en-IN'),
      };

      const updatedExpenses = [
        newExpense,
        ...expenses,
      ];

      await AsyncStorage.setItem(
        'expenses',
        JSON.stringify(updatedExpenses)
      );

      setSaving(false);

      router.back();
    } catch (error) {
      setSaving(false);

      console.log('Failed to save expense:', error);

      Alert.alert(
        'Something went wrong',
        'The expense could not be saved.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Add Expense
            </Text>

            <Text style={styles.subtitle}>
              Record where your money goes
            </Text>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>
            How much did you spend?
          </Text>

          <View style={styles.amountRow}>
            <Text style={styles.currency}>
              ₹
            </Text>

            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#777777"
              keyboardType="decimal-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.label}>
          Expense Title
        </Text>

        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>
            📝
          </Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Dinner, Bus ticket..."
            placeholderTextColor="#999999"
            maxLength={50}
          />
        </View>

        {/* Category */}
        <Text style={styles.label}>
          Category
        </Text>

        <View style={styles.categoryGrid}>
          {categories.map((item) => {
            const selected = category === item.name;

            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.categoryButton,
                  selected &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => setCategory(item.name)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.categoryIconBox,
                    selected &&
                      styles.categoryIconBoxSelected,
                  ]}
                >
                  <Text style={styles.categoryIcon}>
                    {item.icon}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.categoryText,
                    selected &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Category */}
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedInfoLabel}>
            Selected category
          </Text>

          <Text style={styles.selectedInfoValue}>
            {categories.find(
              (item) => item.name === category
            )?.icon}{' '}
            {category}
          </Text>
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={saveExpense}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Expense'}
          </Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  container: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  backText: {
    fontSize: 34,
    lineHeight: 38,
    color: '#111111',
    fontWeight: '300',
    marginTop: -4,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111111',
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },

  amountCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    marginTop: 28,
  },

  amountLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  currency: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    padding: 0,
  },

  label: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 9,
  },

  inputBox: {
    minHeight: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: '#111111',
    fontSize: 15,
    paddingVertical: 14,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  categoryButton: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    marginRight: '3%',
    marginBottom: 10,
    alignItems: 'center',
  },

  categoryButtonSelected: {
    backgroundColor: '#111111',
  },

  categoryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F1F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryIconBoxSelected: {
    backgroundColor: '#292929',
  },

  categoryIcon: {
    fontSize: 21,
  },

  categoryText: {
    color: '#444444',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 7,
  },

  categoryTextSelected: {
    color: '#FFFFFF',
  },

  selectedInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedInfoLabel: {
    color: '#888888',
    fontSize: 13,
  },

  selectedInfoValue: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },

  saveButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  cancelButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#777777',
    fontSize: 15,
    fontWeight: '600',
  },

  bottomSpace: {
    height: 30,
  },
});