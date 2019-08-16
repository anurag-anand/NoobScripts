// I will do ... for ... minutes ,after that
var player = require('play-sound')((opts = {}));
let execSync = require('child_process').execSync;
let excel = require('exceljs');
let workbook1 = new excel.Workbook();
workbook1.creator = 'Me';
workbook1.lastModifiedBy = 'Me';
workbook1.created = new Date();
workbook1.modified = new Date();
let sheet1 = workbook1.addWorksheet('Sheet1');
let reColumns = [
	{ header: 'Time', key: 'time' },
	{ header: 'Item', key: 'item' },
	{ header: 'Duration', key: 'dura' }
];
sheet1.columns = reColumns;
let input = process.stdin;
input.setEncoding('utf-8');

console.log('input text in command line');
let finalArray = [];
function delay(item) {
	return new Promise(resolve => setTimeout(resolve, item * 60 * 1000));
}

async function delayedLog(item) {
	await delay(parseInt(item.dura) + 3);
	player.play('beep.mp3', err => {
		if (err) throw err;
		console.log(new Date().toString(), 'xxx', item.item);
		execSync(
			`zenity --info --value=4 --title=”An Error Occurred ” --text="${
				item.item
			} khatam at ${new Date()
				.toTimeString()
				.substr(
					0,
					8
				)} ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"`
		);
	});
}
async function processArray(array) {
	for (const item of array) {
		await delayedLog(item);
	}
	console.log('Done!');
	process.exit();
}

const abc = () => {
	console.log('ahsklahska');
	// let final = '';

	let hour = new Date().getHours();
	let minute = new Date().getMinutes();

	finalArray.forEach((e, i) => {
		hour += (minute + 3 + parseInt(e.dura)) / 60;
		hour = Math.floor(hour);
		minute = (minute + 3 + parseInt(e.dura)) % 60;
		let temp = {
			time: `${hour % 24}:${
				Math.floor(minute / 10) == 0 ? `0${minute}` : minute
			}`,
			item: `${e.item}`,
			duration: `${e.dura}`
		};
		sheet1.addRow(temp);
	});
	workbook1.xlsx
		.writeFile(`../${new Date().getDate()}-${new Date().getMonth()}TT.xlsx`)
		.then(function() {
			console.log('xlsx file is written.');
			processArray(finalArray);
		});

	// console.log(final);
};
input.on('data', data => {
	if (data === 'exit\n') {
		abc();
	} else {
		let temp = data.split(' ');
		let json = {
			item: temp[0],
			dura: temp[1]
		};
		finalArray.push(json);
	}
});
