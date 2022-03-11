const basePath = process.cwd();
const fs = require("fs");

const {
	baseUri,
	cutoutUri,
	description,
	namePrefix,
} = require(`${basePath}/src/config.js`);

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

const updatedMetadata = [];

data.forEach(item => {
	item.name = `${namePrefix} #${item.edition}`;
	item.description = description;
	item.image = `${baseUri}/${item.edition}.png`;
	item.image_cutout = `${cutoutUri}/${item.edition}.png`;

	// BELOW - fast and dirty, catching missing attributes and adding "None" for easier filtering on marketplaces
	let attrObj = {};
	for (attr of item.attributes) {
		const attrName = attr.trait_type;
		attrObj[attrName] = attr.value;
	}

	if (!attrObj.Earring) {
		item.attributes = [
			{ trait_type: "Earring", value: "None" },
			...item.attributes,
		];
	}

	if (!attrObj.Smoke) {
		item.attributes = [
			{ trait_type: "Smoke", value: "None" },
			...item.attributes,
		];
	}

	if (!attrObj.Eyewear) {
		item.attributes = [
			{ trait_type: "Eyewear", value: "None" },
			...item.attributes,
		];
	}

	if (!attrObj.Headwear) {
		item.attributes = [
			{ trait_type: "Headwear", value: "None" },
			...item.attributes,
		];
	}

	if (!attrObj.Headphones) {
		item.attributes = [
			{ trait_type: "Headphones", value: "None" },
			...item.attributes,
		];
	}

	if (!attrObj.Hair) {
		item.attributes = [
			{ trait_type: "Hair", value: "None" },
			...item.attributes,
		];
	}

	// filter out redundant Background and Outline attributes
	const filteredAttr = item.attributes.filter(
		attr => attr.trait_type !== "Background" && attr.trait_type !== "Outline"
	);

	item.attributes = filteredAttr

	fs.writeFileSync(
		`${basePath}/build/json/${item.edition}.json`,
		JSON.stringify(item, null, 2)
	);

	updatedMetadata.push(item);
});

fs.writeFileSync(
	`${basePath}/build/json/_metadata.json`,
	JSON.stringify(updatedMetadata, null, 2)
);

console.log(`Updated baseUri for images to ===> ${baseUri}`);
console.log(`Updated cutoutUri for cutouts to ===> ${cutoutUri}`);
console.log(`Updated description to ===> ${description}`);
console.log(`Updated name prefix to ===> ${namePrefix}`);
