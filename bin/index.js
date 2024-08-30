#! /usr/bin/env node


import fs from 'fs';
import {Command} from 'commander';
import {parse} from 'json2csv'

const EXPENSE_FILE = "expense.json";

function LoadExpense(){
    if(!fs.existsSync(EXPENSE_FILE)){
        return [];
    }

    const data = fs.readFileSync(EXPENSE_FILE, 'utf-8');
    return JSON.parse(data)
}

function saveExpense(expense){
    fs.writeFileSync(EXPENSE_FILE, JSON.stringify(expense, null, 2))
}

function generateId(expense){
    return expense.length > 0 ? Math.max(...expense.map(m => m.id)) + 1 : 1;
}

function addExpense(description, amount, category){
    let expenses = LoadExpense();
    const newExpense = {
        id: generateId(expenses),
        description: description,
        category: category,
        amount: parseFloat(amount),
        date: new Date().toISOString().slice(0, 10)
    }
    expenses.push(newExpense);
    saveExpense(expenses);
    console.log(`# Expense added successfully. (ID: ${newExpense.id})`);
    
}

function deleteExpense(id){
    let expenses = LoadExpense();
    const intialExpense = expenses.length;
    expenses = expenses.filter(m => m.id !== parseInt(id));
    if(expenses.length < intialExpense){
        saveExpense(expenses);
        console.log(`# Expense deleted successfully (ID: ${id})`);
    } else{
        console.log(`Task with ID ${id} not found.`);
        
    }
}

function listExpense(){
    const expenses = LoadExpense()

    //define the width of each column
    const idWidth = 5;
    const dateWidth = 12;
    const descWidth = 25;
    const amountWidth = 10;
    const catWidth = 20;

    console.log(`# ${'ID'.padEnd(idWidth)} ${'Date'.padEnd(dateWidth)} ${'Description'.padEnd(descWidth)} ${'Amount'.padEnd(amountWidth)} ${'Category'.padEnd(catWidth)}`);
    
    expenses.forEach((e)=> {
        const id = `${e.id}`.padEnd(idWidth)
        const date = `${e.date}`.padEnd(dateWidth);
        const description = `${e.description}`.padEnd(descWidth);
        const amount = `${e.amount}`.padEnd(amountWidth);
        const category = `${e.category}`.padEnd(catWidth)

        console.log(`# ${id} ${date} ${description} ${amount} ${category}`);
        
    })
    
}

function addAmount(month, budget){
    let expenses = LoadExpense();
    let sum = 0;
   
    if(month){
            expenses = expenses.filter(e => {
                const expenseMonth = new Date(e.date).getMonth() + 1;
                return expenseMonth == parseInt(month);
            })
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

     if(month){
        const monthName = monthNames[parseInt(month) - 1]
        console.log(`# Total expenses for ${monthName}: Rs.${sum}`);
        if (budget && sum > budget) {
          console.log(
            `Warning: You have exceeded your budget of Rs.${budget} for ${monthName}`
          );
        }
        
     } else{
        console.log(`# Total expenses: Rs.${sum}`);
        if (budget && sum > budget) {
          console.log(
            `Warning: You have exceeded your budget of Rs.${budget}`
          );
        }
     }
    
}

function filterByCategory(category){
    let expenses = LoadExpense()
    let filterExpenses = expenses.filter(e => e.category === category)

    if(filterExpenses.length > 0){
        console.log(`# Expenses in the category '${category}': `);
        filterExpenses.forEach(e => {
            console.log(`# ${e.description}: Rs.${e.amount} on ${e.date}`);
            
        })
        
    } else{
        console.log(`No expenses found in the category '${category}'.`)
    }
}

function exportToCSV(){
    let expenses = LoadExpense();
    const csv = parse(expenses);
    fs.writeFileSync('expenses.csv', csv);
    console.log(`# Expenses exported to expenses.csv`);
}



const program = new Command()

program
  .name("spendr-cli")
  .description("simple expense tracker to manage your finances.")
  .version("1.0.0");

program
    .command("export")
    .description("Export all expenses to a CSV file.")
    .action(()=> {
        exportToCSV()
    })

program
  .command("add")
  .description("Add the new expenses")
  .option('--desc <desc>', 'Description of the expense')
  .option('--cat <category>', 'Category of the expenses')
  .option('--amt <amount>', 'Amount of the expense')
  .action((options)=> {
        addExpense(options.desc, options.amt, options.cat)
    
  })

program
  .command("filter")
  .description("Filter expenses by category")
  .option('--cat <category>', 'Category to filter by')
  .action((options)=> {
    filterByCategory(options.cat)
  })

program
  .command("delete")
  .description("Delete the existing expenses")
  .option('--id <id>', "ID of the expense")
  .action((options)=> {
        deleteExpense(options.id)
  })

program
  .command("list")
  .description("Listing all the expenses")
  .action(()=> {
    listExpense()
  })

program
  .command("summary")
  .description("Getting total expense.")
  .option("--month <month>", "expenses of the month")
  .option('--budget <budget>', "Set a budget for the month")
  .action((options)=> {
        if(options.month){
            addAmount(options.month, options.budget)
        } else{
            addAmount(null, options.budget);
        }
  })

program.parse(process.argv)