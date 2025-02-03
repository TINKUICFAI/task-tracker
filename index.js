const fs = require("fs");
const readline = require("readline");

// Path to the tasks file
const TASKS_FILE = "./tasks.json";

// Helper function to read tasks from the file
function readTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to write tasks to the file
function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer));
  });
}

async function main() {
  console.log("Welcome to Task Tracker CLI!");
  console.log("Available commands:");
  console.log("- add: Add a new task");
  console.log("- list: List all tasks");
  console.log("- update: Update task status");
  console.log("- delete: Delete a task");
  console.log("- exit: Exit the application");

  while (true) {
    const command = await askQuestion("\nEnter a command: ");

    if (command === "add") {
      const title = await askQuestion("Enter task title: ");
      const tasks = readTasks();
      const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        status: "pending",
      };
      tasks.push(newTask);
      writeTasks(tasks);
      console.log(`Task "${title}" added successfully!`);
    } else if (command === "list") {
      const tasks = readTasks();
      if (tasks.length === 0) {
        console.log("No tasks found.");
      } else {
        console.log("\nYour Tasks:");
        tasks.forEach((task) => {
          console.log(`${task.id}. [${task.status}] ${task.title}`);
        });
      }
    } else if (command === "update") {
      const tasks = readTasks();
      const taskId = parseInt(
        await askQuestion("Enter task ID to update: "),
        10
      );
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        console.log("Task not found.");
      } else {
        const newStatus = await askQuestion(
          `Current status: ${task.status}. Enter new status (pending/in-progress/completed): `
        );
        if (["pending", "in-progress", "completed"].includes(newStatus)) {
          task.status = newStatus;
          writeTasks(tasks);
          console.log(`Task ${taskId} updated successfully!`);
        } else {
          console.log("Invalid status.");
        }
      }
    } else if (command === "delete") {
      const tasks = readTasks();
      const taskId = parseInt(
        await askQuestion("Enter task ID to delete: "),
        10
      );
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) {
        console.log("Task not found.");
      } else {
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        writeTasks(tasks);
        console.log(`Task "${deletedTask.title}" deleted successfully!`);
      }
    } else if (command === "exit") {
      console.log("Exiting Task Tracker CLI. Goodbye!");
      break;
    } else {
      console.log("Invalid command. Please try again.");
    }
  }

  rl.close();
}

main();
