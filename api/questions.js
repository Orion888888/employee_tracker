// Validate Function
const validateNonEmpty = (promptName) => {
	if (promptName) {
		return true;
	} else {
		throw new Error(`Please select a ${promptName}`);
	}
};


// Command Question
const commandQuestion = [
	{
		type: "list",
		message: "Please provide a command:",
		name: "command",
		choices: [
			"View all departments",
			"View all roles",
			"View all employees",
			"Add a department",
			"Add a role",
			"Add an employee",
			"Update an employee's role",
			"Exit"],
		validate: validateNonEmpty("command")
	}
];

const addDepartmentQuestion = [
	{
		type: "input",
		message: "Name of the new department:",
		name: "newDepartment",
		validate: function (newDepartment) {
			if (newDepartment && newDepartment.length <= 30) {
				return true;
			} else {
				throw new Error("Please provide a response with fewer than 30 characters")
			}
		}
	}
];

const addRoleQuestions = [
	{
		type: "input",
		message: "Job title of the new role:",
		name: "newJobTitle",
		validate: function (newJobTitle) {
			if (newJobTitle && newJobTitle.length <= 30) {
				return true;
			} else {
				throw new Error("Please provide a response with fewer than 30 characters")
			}
		}
	}, 
	{
		type: "number",
		message: "Salary of the new role:",
		name: "newJobSalary",
		validate: function (newJobSalary) {
			if (newJobSalary) {
				return true;
			} else {
				throw new Error("Please provide a response a numeric response. Press the up arrow and backspace to adjust your response")
			}
		}
	},
	{
		type: "number",
		message: "Department ID of the new role:",
		name: "newJobDepartment",
		validate: function (newJobDepartment) {
			if (newJobDepartment) {
				return true;
			} else {
				throw new Error("Please provide a response a numeric response. Press the up arrow and backspace to adjust your response")
			}
		}
	}
];

const addEmployeeQuestions = [
	{
		type: "input",
		message: "New employee's first name:",
		name: "newFirstName",
		validate: function (newFirstName) {
			if (newFirstName && newFirstName.length <= 30) {
				return true;
			} else {
				throw new Error("Please provide a response with fewer than 30 characters")
			}
		}
	},
	{
		type: "input",
		message: "New employee's last name:",
		name: "newLastName",
		validate: function (newLastName) {
			if (newLastName && newLastName.length <= 30) {
				return true;
			} else {
				throw new Error("Please provide a response with fewer than 30 characters")
			}
		}
	},
	{
		type: "number",
		message: "Role ID of the new employee:",
		name: "newEmpRole",
		validate: function (newEmpRole) {
			if (newEmpRole) {
				return true;
			} else {
				throw new Error("Please provide a response a numeric response. Press the up arrow and backspace to adjust your response")
			}
		}
	},
	{
		type: "number",
		message: "Manager ID of the new employee. If no manager, enter -99:",
		name: "newEmpManager",
		validate: function (newEmpManager) {
			if (newEmpManager) {
				return true;
			} else {
				throw new Error("Please provide a response a numeric response. Press the up arrow and backspace to adjust your response")
			}
		}
	}
];

const updateRoleQuestions = [
	{
		type: "number",
		message: "Employee ID:",
		name: "employeeID",
		validate: function (employeeID) {
			if (employeeID) {
				return true;
			} else {
				throw new Error("Please provide a response a numeric response. Press the up arrow and backspace to adjust your response")
			}
		}
	},
	{
		type: "number",
		message: "New role ID:",
		name: "roleID",
		validate: function (roleID) {
			if (roleID) {
				return true;
			} else {
				throw new Error("Please provide a response a numeric response. Press the up arrow and backspace to adjust your response")
			}
		}
	}
];

module.exports = {
	validateNonEmpty,
	commandQuestion,
	addDepartmentQuestion,
	addRoleQuestions,
	addEmployeeQuestions,
	updateRoleQuestions
}