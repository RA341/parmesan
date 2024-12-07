console.log('💈 Content script loaded for', chrome.runtime.getManifest().name);

const browserAPI = chrome || browser;

async function sendInfo(apikey, url) {
	console.log('Sending ');
	const author = getAuthorText() ?? ""
	const bookName = getTitleText() ?? ""
	const link = getDownloadLink() ?? ""
	const book_url = window.location.href

	const body = JSON.stringify({
		file_link: link,
		author: author,
		book: bookName,
		category: "iso",
		mam_url: book_url
	})

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: apikey
		},
		body: body
	};

	const resp = await fetch(`${url}/torrent/addTorrent`, options)
	if (resp.status > 400) {
		throw new Error(`Failed to call api. Status:${resp.statusText}, message: ${resp.statusText}`);
	}
}

function getAuthorText() {
	const authorElement = document.querySelector('.torDetRight.torAuthors a');
	if (authorElement) {
		return authorElement.textContent.trim();
	}
	console.log('Author element not found');
	return null;
}

function getTitleText() {
	const titleElement = document.querySelector('.torDetRight .TorrentTitle');
	if (titleElement) {
		return titleElement.textContent.trim();
	}
	console.log('Title element not found');
	return null;
}

function getDownloadLink() {
	const downloadElement = document.querySelector('#tddl');
	if (downloadElement) {
		return downloadElement.href;
	}
	console.log('Download link not found');
	return null;
}

function updateButtonState(button, state, duration = 2000) {
	// Store the previous state
	const previousState = {
		text: button.textContent,
		backgroundColor: button.style.backgroundColor,
		color: button.style.color
	};

	// Update to new state
	button.textContent = state.text;
	button.style.backgroundColor = state.backgroundColor;
	button.style.color = state.color;

	// Reset to previous state after duration
	setTimeout(() => {
		button.textContent = previousState.text;
		button.style.backgroundColor = previousState.backgroundColor;
		button.style.color = previousState.color;
	}, duration);
}

const buttonStates = {
	default: {
		text: 'Send to gouda',
		backgroundColor: 'green',
		color: 'white'
	},
	notSetup: {
		text: 'Extension is not setup',
		backgroundColor: 'grey',
		color: 'white'
	},
	success: {
		text: 'Success!',
		backgroundColor: '#4CAF50',
		color: 'white'
	},
	failure: {
		text: 'Failed!',
		backgroundColor: '#f44336',
		color: 'white'
	}
};

async function init() {
	const settings = await browserAPI.storage.sync.get(['gouda_baseurl', 'gouda_apikey']);

	const downloadDiv = document.createElement('div');
	downloadDiv.id = 'download';
	downloadDiv.className = 'torDetInnerCon';

	const innerTop = document.createElement('div');
	innerTop.className = 'torDetInnerTop';

	const innerBottom = document.createElement('div');
	innerBottom.className = 'torDetInnerBottom';

	const downloadLink = document.createElement('a');
	downloadLink.id = 'tddl';
	downloadLink.title = 'Gouda'
	downloadLink.className = 'torFormButton';
	downloadLink.title = 'Send to gouda';
	downloadLink.textContent = 'Parmesan is not setup';
	downloadLink.style.backgroundColor = 'grey';  // Only the button is green
	downloadLink.style.color = 'white';  // White text for contra

	if (settings.gouda_baseurl && settings.gouda_apikey) {
		downloadLink.textContent = 'Send to gouda';
		downloadLink.style.backgroundColor = 'green';  // Only the button is green
		downloadLink.style.color = 'white';  // White text for contra
		downloadLink.onclick = async (ev) => {
			try {
				ev.preventDefault();
				await sendInfo(settings.gouda_apikey, settings.gouda_baseurl);
				updateButtonState(downloadLink, buttonStates.success);
			} catch (error) {
				console.log(error)
				alert(`Failed to send to gouda, check your apikey and url in settings: ${error}`)
				updateButtonState(downloadLink, buttonStates.failure);
			}
		};
	} else {
		console.log('Could not find base url or apikey');
	}

	// Assemble the elements
	innerBottom.appendChild(downloadLink);
	downloadDiv.appendChild(innerTop);
	downloadDiv.appendChild(innerBottom);

	// Find the uploader div and inject our new element after it
	const uploaderDiv = document.getElementById('uploader');
	if (uploaderDiv) {
		uploaderDiv.parentNode.insertBefore(downloadDiv, uploaderDiv.nextSibling);
	} else {
		console.log('Unable to find torrent details box');
	}
}

init();
