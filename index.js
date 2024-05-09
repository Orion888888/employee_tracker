const {runInquirer, commandQuestion} = require('./api/inquirer');

const init = () => {
	runInquirer(commandQuestion);
};

init();