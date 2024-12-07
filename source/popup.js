// Initialize form with saved values
async function initializeForm() {
	console.log('initializing... form');

	const options = await optionsStorage.getAll();
	const form = document.getElementById('options-form');

	// Set form values from storage
	// Object.entries(options).forEach(([key, value]) => {
	// 	const input = form.querySelector(`[name="${key}"]`);
	// 	if (input) {
	// 		input.value = value;
	// 	}
	// });

	// Handle form submission
	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		console.log('Submitting value')

		// Get all form values
		// const formData = new FormData(form);
		// const newOptions = {};
		// for (const [key, value] of formData.entries()) {
		// 	newOptions[key] = value;
		// }

		// test url and connection
		// fetch(`${newOptions.baseUrl}/auth/test`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: newOptions.apikey
		// 	}
		// }).then(async response => {
		// 	// Save options
		// 	await optionsStorage.set(newOptions);
		//
		// 	// Show save confirmation
		// 	const button = form.querySelector('button');
		// 	const originalText = button.textContent;
		// 	button.textContent = 'Saved!';
		// 	button.style.backgroundColor = '#28a745';
		//
		// 	setTimeout(() => {
		// 		button.textContent = originalText;
		// 		button.style.backgroundColor = '#4CAF50';
		// 	}, 1500);
		// }).catch(error => {
		// 	console.log(error)
		// 	alert(error)
		// });

	});
}

initializeForm();
