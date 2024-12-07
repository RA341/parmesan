import optionsStorage from './options-storage.js';

console.log('💈 Content script loaded for', chrome.runtime.getManifest().name);

function createClickHandler(apikey, url) {
	return function (event) {
		event.preventDefault();
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

		fetch(`${url}/torrent/addTorrent`, options)
			.then(response => response.json())
			.then(response => console.log(response))
			.catch(err => console.error(err));
	};
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

async function init() {
	const options = await optionsStorage.getAll();


	// const color = `rgb(${options.colorRed}, ${options.colorGreen},${options.colorBlue})`;
	// const text = options.text;


	const downloadDiv = document.createElement('div');
	downloadDiv.id = 'download';
	downloadDiv.className = 'torDetInnerCon';

	const innerTop = document.createElement('div');
	innerTop.className = 'torDetInnerTop';

	const innerBottom = document.createElement('div');
	innerBottom.className = 'torDetInnerBottom';

	const downloadLink = document.createElement('a');
	downloadLink.id = 'tddl';
	downloadLink.className = 'torFormButton';
	downloadLink.title = 'Send to gouda';
	downloadLink.textContent = 'Extension is not setup';
	downloadLink.style.backgroundColor = 'grey';  // Only the button is green
	downloadLink.style.color = 'white';  // White text for contra

	const key = options.apikey;
	const baseUrl = options.baseUrl;

	if (baseUrl && key) {
		downloadLink.textContent = 'Send to gouda';
		downloadLink.style.backgroundColor = 'green';  // Only the button is green
		downloadLink.style.color = 'white';  // White text for contra
		downloadLink.onclick = createClickHandler(key, baseUrl);
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
