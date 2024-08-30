# Spendr CLI

**spendr-cli** is a simple command-line interface (CLI) tool that helps you manage your expenses. With spendr-cli, you can easily add, list, filter, delete, and export your expenses, as well as get summaries and set budgets.

## Features

- **Add Expenses**: Record your expenses with descriptions, categories, and amounts.
- **List Expenses**: View all recorded expenses in a clean and organized format.
- **Filter by Category**: Filter expenses by specific categories.
- **Delete Expenses**: Remove expenses by their ID.
- **Summary**: Get the total expenses, and set budgets to track spending.
- **Export to CSV**: Export all your expenses to a CSV file for easy sharing or backup.

## Installation

To install spendr-cli, you need to have [Node.js](https://nodejs.org/) installed. You can then install the CLI globally using the following command:

```bash
npm install -g spendr-cli
```

## Usage

After installing, you can start using `spendr-cli` with the command `spendr`. Below are the available commands:

### Add an Expense

```bash
spendr add --desc <description> --cat <category> --amt <amount>
```

- `--desc`: Description of the expense.
- `--cat`: Category of the expense (e.g., food, travel, etc.).
- `--amt`: Amount of the expense.

### List All Expenses

```bash
spendr list
```

This command will list all the recorded expenses in a formatted table.

### Filter by Category

```bash
spendr filter --cat <category>
```

- `--cat`: Category to filter by.

### Delete an Expense

```bash
spendr delete --id <id>
```

- `--id`: ID of the expense to delete.

### Get a Summary of Expenses

```bash
spendr summary [--month <month>] [--budget <budget>]
```

- `--month`: (Optional) Filter expenses by month (1-12).
- `--budget`: (Optional) Set a budget to track if expenses exceed it.

### Export to CSV

```bash
spendr export
```

This command exports all recorded expenses to a CSV file named `expenses.csv`.

## Example Usage

Add an expense:

```bash
spendr add --desc "Lunch at a restaurant" --cat "Food" --amt 500
```

List all expenses:

```bash
spendr list
```

Filter expenses by category:

```bash
spendr filter --cat "Food"
```

Delete an expense by ID:

```bash
spendr delete --id 2
```

Get a summary of expenses for March with a budget:

```bash
spendr summary --month 3 --budget 10000
```

Export expenses to CSV:

```bash
spendr export
```

## License

This project is licensed under the ISC License.

## Author

**Kartik Labhshetwar**

Feel free to reach out for any queries or contributions!


https://roadmap.sh/projects/expense-tracker