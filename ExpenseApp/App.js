import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('expenses.sqlite');

function initDb() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, method TEXT, note TEXT, date TEXT)'
    );
  });
}

function addExpense(amount, method, note) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO expenses (amount, method, note, date) values (?, ?, ?, date(\'now\'))', [amount, method, note]);
  });
}

function getExpenses(setExpenses) {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM expenses ORDER BY date DESC', [], (_, { rows }) => {
      setExpenses(rows._array);
    });
  });
}

function ExpenseEntryScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [note, setNote] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Text>Amount</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Method (cash/credit)</Text>
      <TextInput value={method} onChangeText={setMethod} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Note</Text>
      <TextInput value={note} onChangeText={setNote} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Save" onPress={() => { addExpense(parseFloat(amount), method, note); setAmount(''); setNote(''); }} />
      <Button title="View Report" onPress={() => navigation.navigate('Report')} />
    </View>
  );
}

function ReportScreen() {
  const [expenses, setExpenses] = useState([]);
  useEffect(() => { getExpenses(setExpenses); }, []);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Total: {total}</Text>
      <FlatList data={expenses} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (
        <Text>{item.date} - {item.method}: {item.amount} ({item.note})</Text>
      )} />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => { initDb(); }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Entry" component={ExpenseEntryScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
