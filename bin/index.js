#!/usr/bin/env node

import fs from "fs";
import { Command } from "commander";
import { parse } from "json2csv";
import chalk from "chalk";

const EXPENSE_FILE = "expense.json";

function LoadExpense() {
  if (!fs.existsSync(EXPENSE_FILE)) {
    return [];
  }

  const data = fs.readFileSync(EXPENSE_FILE, "utf-8");
  return JSON.parse(data);
}

function saveExpense(expenses) {
  fs.writeFileSync(EXPENSE_FILE, JSON.stringify(expenses, null, 2));
}

function generateId(expenses) {
  return expenses.length > 0 ? Math.max(...expenses.map((m) => m.id)) + 1 : 1;
}

function addExpense(description, amount, category) {
  let expenses = LoadExpense();
  const newExpense = {
    id: generateId(expenses),
    description: description,
    category: category,
    amount: parseFloat(amount),
    date: new Date().toISOString().slice(0, 10),
  };
  expenses.push(newExpense);
  saveExpense(expenses);
  console.log(
    chalk.green.bold(`# Expense added successfully. (ID: ${newExpense.id})`)
  );
}

function deleteExpense(id) {
  let expenses = LoadExpense();
  const initialExpense = expenses.length;
  expenses = expenses.filter((m) => m.id !== parseInt(id));
  if (expenses.length < initialExpense) {
    saveExpense(expenses);
    console.log(chalk.red.bold(`# Expense deleted successfully. (ID: ${id})`));
  } else {
    console.log(chalk.yellow(`# Expense with ID ${id} not found.`));
  }
}

function listExpense() {
  const expenses = LoadExpense();

  const idWidth = 5;
  const dateWidth = 12;
  const descWidth = 25;
  const amountWidth = 10;
  const catWidth = 20;

  console.log(
    chalk.blue.bold(
      `# ${"ID".padEnd(idWidth)} ${"Date".padEnd(
        dateWidth
      )} ${"Description".padEnd(descWidth)} ${"Amount".padEnd(
        amountWidth
      )} ${"Category".padEnd(catWidth)}`
    )
  );

  expenses.forEach((e) => {
    const id = `${e.id}`.padEnd(idWidth);
    const date = `${e.date}`.padEnd(dateWidth);
    const description = `${e.description}`.padEnd(descWidth);
    const amount = `${e.amount}`.padEnd(amountWidth);
    const category = `${e.category}`.padEnd(catWidth);

    console.log(
      `# ${chalk.cyan(id)} ${chalk.magenta(date)} ${chalk.green(
        description
      )} ${chalk.yellow(amount)} ${chalk.blue(category)}`
    );
  });
}

function addAmount(month, budget) {
  let expenses = LoadExpense();
  let sum = 0;

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
      chalk.blue.bold(`# Total expenses for ${monthName}: Rs.${sum}`)
    );
    if (budget && sum > budget) {
      console.log(
        chalk.red.bold(
          `Warning: You have exceeded your budget of Rs.${budget} for ${monthName}`
        )
      );
    }
  } else {
    console.log(chalk.blue.bold(`# Total expenses: Rs.${sum}`));
    if (budget && sum > budget) {
      console.log(
        chalk.red.bold(`Warning: You have exceeded your budget of Rs.${budget}`)
      );
    }
  }
}

function filterByCategory(category) {
  let expenses = LoadExpense();
  let filterExpenses = expenses.filter((e) => e.category === category);

  if (filterExpenses.length > 0) {
    console.log(chalk.blue.bold(`# Expenses in the category '${category}':`));
    filterExpenses.forEach((e) => {
      console.log(
        chalk.cyan(`# ${e.description}: Rs.${e.amount} on ${e.date}`)
      );
    });
  } else {
    console.log(
      chalk.yellow(`No expenses found in the category '${category}'.`)
    );
  }
}

function exportToCSV() {
  let expenses = LoadExpense();
  const csv = parse(expenses);
  fs.writeFileSync("expenses.csv", csv);
  console.log(chalk.green.bold(`# Expenses exported to expenses.csv`));
}

const program = new Command();

program
  .name("spendr-cli")
  .description("Simple expense tracker to manage your finances.")
  .version("1.0.0");

program
  .command("export")
  .description("Export all expenses to a CSV file.")
  .action(() => {
    exportToCSV();
  });

program
  .command("add")
  .description("Add a new expense.")
  .option("--desc <desc>", "Description of the expense")
  .option("--cat <category>", "Category of the expense")
  .option("--amt <amount>", "Amount of the expense")
  .action((options) => {
    addExpense(options.desc, options.amt, options.cat);
  });

program
  .command("filter")
  .description("Filter expenses by category.")
  .option("--cat <category>", "Category to filter by")
  .action((options) => {
    filterByCategory(options.cat);
  });

program
  .command("delete")
  .description("Delete an existing expense.")
  .option("--id <id>", "ID of the expense")
  .action((options) => {
    deleteExpense(options.id);
  });

program
  .command("list")
  .description("List all expenses.")
  .action(() => {
    listExpense();
  });

program
  .command("summary")
  .description("Get a summary of your expenses.")
  .option("--month <month>", "Expenses of the month")
  .option("--budget <budget>", "Set a budget for the month")
  .action((options) => {
    if (options.month) {
      addAmount(options.month, options.budget);
    } else {
      addAmount(null, options.budget);
    }
  });

program.parse(process.argv);
