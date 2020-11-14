// Dependencies
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

// File Creation
const mkDir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Questions Array
const questions = [
  { name: "name", message: "What is the employee's name?" },
  { name: "id", message: "What's the employee's ID?" },
  { name: "email", message: "What is the employee's email?" },
  {
    type: "list",
    name: "role",
    message: "What's the employee's role?",
    choices: ["Manager", "Engineer", "Intern"],
  },
];

// Role specific questions
const managerQuestions = [
  { name: "office", message: "What's the manager's office number?" },
];

const engineerQuestions = [
  { name: "github", message: "What is the engineer's Github account?" },
];

const internQuestions = [
  { name: "school", message: "What school does the intern attend?" },
];

const confirm = [
  {
    type: "confirm",
    name: "addEmployee",
    message: "Do you want to input more employee information?",
  },
];

// Function that runs the inquirer prompts and pushes collected information to employees array
const start = async () => {
  const employees = [];
  let newEmployee = true;

  while (newEmployee) {
    const { name, id, email, role } = await inquirer.prompt(questions);

    if (role === "Manager") {
      const { office } = await inquirer.prompt(managerQuestions);
      // create new manager object and push to employees array
      employees.push(new Manager(name, id, email, office));
    } else if (role === "Engineer") {
      const { github } = await inquirer.prompt(engineerQuestions);
      // create new engineer object and push to employees array
      employees.push(new Engineer(name, id, email, github));
    } else {
      const { school } = await inquirer.prompt(internQuestions);
      // create new intern object and push to employees array
      employees.push(new Intern(name, id, email, school));
    }
    // addEmployee variable will return a boolean value based on user response to input more info, will end inputs on false
    const { addEmployee } = await inquirer.prompt(confirm);

    newEmployee = addEmployee;
  }

  const html = render(employees);

  if (!fs.existsSync(outputPath)) {
    const error = await mkDir(OUTPUT_DIR);
    error && console.error(error);
  }

  const error = await writeFile(outputPath, html);
  error && console.error(error);
};

start();
