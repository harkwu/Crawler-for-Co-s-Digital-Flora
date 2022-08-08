const puppeteer = require('puppeteer');
const fs = require('fs/promises');

// const baseURL = 'https://www.philippineplants.org/Families/Actinidiaceae.html';

const crawlerAll = () => {
	
	let familyNamePre = '';

	const familyName = familyNamePre.split(' ');

	for (let i = 0; i < familyName.length; i++) {
		const baseURL = `https://www.philippineplants.org/Families/${familyName[i]}.html`;
		crawlerNWriteFile(baseURL, familyName[i]);
	}
};

const crawlerNWriteFile = async (url, family) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	const data = await page.evaluate(() => {
		const keyword = [
			
		];
		//code that executed in browser env
		const key = Array.from(document.querySelectorAll('li')).map((li) => li.children[0].innerText);
		const value = Array.from(document.querySelectorAll('li')).map((li) => {
			let location = [];
			for (let i = 0; i < keyword.length; i++) {
				if (li.innerText.toLowerCase().indexOf(keyword[i]) !== -1) {
					location.push(keyword[i]);
				}
			}
			return location;
		});

		const assemble = (key, value) => {
			let dataObj = {};
			for (let i = 0; i < key.length; i++) {
				dataObj[key[i]] = value[i];
			}
			return dataObj;
		};
		const toCsv = (data) => {
			let result = [];
			for (let i of Object.keys(data)) {
				result.push(`${i},${data[i]}`);
			}
			return result;
		};

		const data = assemble(key, value);
		const csvData = toCsv(data).join(',\r\n');
		return csvData;
	});

	await fs.writeFile(`${family}.csv`, data);
	await browser.close();
};

crawlerAll();
