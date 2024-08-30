#!/usr/bin/env node

import fs from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import boxen from 'boxen';
import {parse} from "json2csv"

const EXPENSE_FILE = "expense.json";

function LoadExpense() {
    if (!fs.existsSync(EXPENSE_FILE)) {
        return [];
    }

    const data = fs.readFileSync(EXPENSE_FILE, 'utf-8');
    return JSON.parse(data);
}

function saveExpense(expenses) {
    fs.writeFileSync(EXPENSE_FILE, JSON.stringify(expenses, null, 2));
}

function generateId(expenses) {
    return expenses.length > 0 ? Math.max(...expenses.map(m => m.id)) + 1 : 1;
}

async function addExpense() {
    const expenses = LoadExpense();
    
    const answers = await inquirer.prompt([
        { type: 'input', name: 'description', message: 'Enter the expense description:' },
        { type: 'input', name: 'amount', message: 'Enter the expense amount:', validate: (value) => !isNaN(parseFloat(value)) || 'Please enter a valid number' },
        { type: 'input', name: 'category', message: 'Enter the expense category:' },
    ]);

    const newExpense = {
        id: generateId(expenses),
        description: answers.description,
        category: answers.category,
        amount: parseFloat(answers.amount),
        date: new Date().toISOString().slice(0, 10)
    };

    expenses.push(newExpense);
    
    const spinner = ora('Saving expense...').start();
    saveExpense(expenses);
    spinner.succeed('Expense saved successfully!');
    
    console.log(boxen(chalk.green.bold(`Expense added successfully! (ID: ${newExpense.id})`), { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'green' }));
}

async function deleteExpense() {
    const expenses = LoadExpense();
    
    const { id } = await inquirer.prompt({
        type: 'input',
        name: 'id',
        message: 'Enter the ID of the expense to delete:',
        validate: (value) => !isNaN(parseInt(value)) || 'Please enter a valid number'
    });

    const initialExpense = expenses.length;
    const filteredExpenses = expenses.filter(expense => expense.id !== parseInt(id));

    if (filteredExpenses.length < initialExpense) {
        saveExpense(filteredExpenses);
        console.log(chalk.red.bold(`Expense with ID ${id} deleted successfully.`));
    } else {
        console.log(chalk.yellow(`Expense with ID ${id} not found.`));
    }
}

function listExpense() {
    const expenses = LoadExpense();

    const idWidth = 5;
    const dateWidth = 12;
    const descWidth = 25;
    const amountWidth = 10;
    const catWidth = 20;

    console.log(chalk.blue.bold(`# ${'ID'.padEnd(idWidth)} ${'Date'.padEnd(dateWidth)} ${'Description'.padEnd(descWidth)} ${'Amount'.padEnd(amountWidth)} ${'Category'.padEnd(catWidth)}`));

    expenses.forEach((e) => {
        const id = `${e.id}`.padEnd(idWidth);
        const date = `${e.date}`.padEnd(dateWidth);
        const description = `${e.description}`.padEnd(descWidth);
        const amount = `${e.amount}`.padEnd(amountWidth);
        const category = `${e.category}`.padEnd(catWidth);

        console.log(`# ${chalk.cyan(id)} ${chalk.magenta(date)} ${chalk.green(description)} ${chalk.yellow(amount)} ${chalk.blue(category)}`);
    });
}

async function addAmount() {
  let expenses = LoadExpense();
  let sum = 0;

  const { month, budget } = await inquirer.prompt([
    {
      type: "input",
      name: "month",
      message:
        "Enter the month (1-12) to get expenses for, or leave blank for all:",
      validate: (value) =>
        value === "" ||
        (parseInt(value) >= 1 && parseInt(value) <= 12) ||
        "Please enter a valid month (1-12) or leave blank.",
    },
    {
      type: "input",
      name: "budget",
      message: "Enter your budget, or leave blank if you don’t have one:",
      validate: (value) =>
        value === "" ||
        !isNaN(parseFloat(value)) ||
        "Please enter a valid number for budget or leave blank.",
    },
  ]);

  if (month) {
    expenses = expenses.filter((e) => {
      const expenseMonth = new Date(e.date).getMonth() + 1;
      return expenseMonth == parseInt(month);
    });
  }

  expenses.forEach((e) => {
    sum += e.amount;
  });

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
    "December",
  ];

  if (month) {
    const monthName = monthNames[parseInt(month) - 1];
    console.log(
      boxen(chalk.cyan.bold(`Total expenses for ${monthName}: Rs.${sum}`), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      })
    );

    if (budget && sum > parseFloat(budget)) {
      console.log(
        chalk.red.bold(
          `Warning: You have exceeded your budget of Rs.${budget} for ${monthName}.`
        )
      );
    }
  } else {
    console.log(
      boxen(chalk.cyan.bold(`Total expenses: Rs.${sum}`), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      })
    );

    if (budget && sum > parseFloat(budget)) {
      console.log(
        chalk.red.bold(
          `Warning: You have exceeded your budget of Rs.${budget}.`
        )
      );
    }
  }
}

async function filterByCategory() {
  const expenses = LoadExpense();
  const { category } = await inquirer.prompt({
    type: "input",
    name: "category",
    message: "Enter the category to filter by:",
  });

  const filteredExpenses = expenses.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  );

  if (filteredExpenses.length > 0) {
    console.log(chalk.green.bold(`# Expenses in the category '${category}':`));
    filteredExpenses.forEach((e) => {
      console.log(
        `# ${chalk.yellow(e.description)}: Rs.${chalk.green(
          e.amount
        )} on ${chalk.blue(e.date)}`
      );
    });
  } else {
    console.log(
      chalk.red.bold(`No expenses found in the category '${category}'.`)
    );
  }
}

function exportToCSV() {
  const expenses = LoadExpense();
  const csv = parse(expenses);
  const spinner = ora("Exporting expenses to CSV...").start();

  try {
    fs.writeFileSync("expenses.csv", csv);
    spinner.succeed("Expenses exported successfully to expenses.csv!");
  } catch (error) {
    spinner.fail("Failed to export expenses to CSV.");
  }
}

const program = new Command();

program
  .name("spendr-cli")
  .description("Simple expense tracker to manage your finances.")
  .version("1.0.0");

program
  .command("add")
  .description("Add a new expense.")
  .action(() => {
    addExpense();
  });

program
  .command("delete")
  .description("Delete an existing expense.")
  .action(() => {
    deleteExpense();
  });

program
  .command("list")
  .description("List all expenses.")
  .action(() => {
    listExpense();
  });

program
  .command("summary")
  .description(
    "Get total expense with optional monthly filter and budget check."
  )
  .action(() => {
    addAmount();
  });

program
  .command("filter")
  .description("Filter expenses by category.")
  .action(() => {
    filterByCategory();
  });

program
  .command("export")
  .description("Export all expenses to a CSV file.")
  .action(() => {
    exportToCSV();
  });

program.parse(process.argv);
