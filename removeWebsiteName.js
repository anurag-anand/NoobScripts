const { readdirSync, rename } = require('fs');
const { join } = require('path');

const pathname = 'output of pwd';

let directory = readdirSync(pathname);
console.log(directory);

directory.forEach(folder => {
	let dirname = folder;
	let newdirname = folder.split(']')[1] || dirname;
	let dirpath = pathname + '/' + dirname;
	let newpath = pathname + '/' + newdirname;
	rename(dirpath, newpath, err => {
		if (!err) console.log('folder renamed');
	});
});
