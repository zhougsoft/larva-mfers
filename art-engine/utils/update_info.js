const basePath = process.cwd();
const fs = require("fs");

const {
	baseUri,
	cutoutUri,
	description,
	namePrefix,
} = require(`${basePath}/src/config.js`);


 // TODO: PUT CUTOUT URI WHERE IT NEEDS TO BE

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach(item => {
	item.name = `${namePrefix} #${item.edition}`;
	item.description = description;
	item.image = `${baseUri}/${item.edition}.png`;
	item.image_cutout = `${cutoutUri}/${item.edition}.png`;

	fs.writeFileSync(
		`${basePath}/build/json/${item.edition}.json`,
		JSON.stringify(item, null, 2)
	);
});

fs.writeFileSync(
	`${basePath}/build/json/_metadata.json`,
	JSON.stringify(data, null, 2)
);

console.log(`Updated baseUri for images to ===> ${baseUri}`);
console.log(`Updated cutoutUri for cutouts to ===> ${cutoutUri}`);
console.log(`Updated description to ===> ${description}`);
console.log(`Updated name prefix to ===> ${namePrefix}`);
