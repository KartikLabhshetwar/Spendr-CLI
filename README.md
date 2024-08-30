# Spendr CLI

![Spendr CLI](https://img.shields.io/badge/Spendr-CLI-brightgreen)

A simple and interactive CLI tool to manage your expenses effectively. Track your finances by adding, deleting, listing, filtering, and summarizing expenses with ease. Export your expense data to a CSV file for further analysis.

## Features

- **Add Expenses**: Quickly add new expenses with description, amount, and category.
- **Delete Expenses**: Remove any expense by its ID.
- **List Expenses**: Display all recorded expenses in a structured format.
- **Filter by Category**: Filter expenses by specific categories to better analyze spending.
- **Monthly Summary**: View total expenses for a given month and check against a budget.
- **Export to CSV**: Export all expenses to a CSV file for further analysis or backup.

## Installation

To install the `spendr-cli` tool, you need to have [Node.js](https://nodejs.org/) installed on your machine. Then, install the tool using npm:

```bash
npm install -g spendr-cli
```

## Usage

You can use the `spendr-cli` to manage your expenses directly from the command line. Below are the available commands:

### Add a New Expense

```bash
spendr add
```

This command will prompt you for the description, amount, and category of the expense.

### Delete an Existing Expense

```bash
spendr delete
```

This command will prompt you for the ID of the expense you wish to delete.

### List All Expenses

```bash
spendr list
```

This command will list all recorded expenses in a structured and readable format.

### Filter Expenses by Category

```bash
spendr filter
```

This command will prompt you for the category to filter the expenses.

### Get Monthly Summary and Check Budget

```bash
spendr summary
```

This command will prompt you to enter the month and budget (optional). It will then display the total expenses for that month and check if you've exceeded your budget.

### Export Expenses to CSV

```bash
spendr export
```

This command exports all expenses to a `expenses.csv` file in the current directory.

## Example

Here's an example of how you might interact with `spendr-cli`:

1. **Add an Expense:**

    ```bash
    $ spendr add
    ```

    ```plaintext
    ? Enter the expense description: Lunch
    ? Enter the expense amount: 200
    ? Enter the expense category: Food
    ```

    ```plaintext
    Expense added successfully! (ID: 1)
    ```

2. **List Expenses:**

    ```bash
    $ spendr list
    ```

    ```plaintext
    ID    Date         Description               Amount     Category
    1     2024-08-30   Lunch                     200.00     Food
    ```

3. **Filter by Category:**

    ```bash
    $ spendr filter
    ```

    ```plaintext
    ? Enter the category to filter by: Food
    ```

    ```plaintext
    # Expenses in the category 'Food':
    # Lunch: Rs.200.00 on 2024-08-30
    ```

4. **Get a Monthly Summary:**

    ```bash
    $ spendr summary
    ```

    ```plaintext
    ? Enter the month (1-12) to get expenses for, or leave blank for all: 8
    ? Enter your budget, or leave blank if you don’t have one: 500
    ```

    ```plaintext
    Total expenses for August: Rs.200.00
    ```

5. **Export Expenses to CSV:**

    ```bash
    $ spendr export
    ```

    ```plaintext
    Expenses exported successfully to expenses.csv!
    ```

## License

This project is licensed under the ISC License.

## Author

**Kartik Labhshetwar**

Feel free to reach out for any queries or contributions!


https://roadmap.sh/projects/expense-tracker