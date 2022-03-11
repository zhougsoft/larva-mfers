const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require("fs");
const sha1 = require(`${basePath}/node_modules/sha1`);
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
	format,
	baseUri,
	description,
	background,
	uniqueDnaTorrance,
	layerConfigurations,
	rarityDelimiter,
	shuffleLayerConfigurations,
	debugLogs,
	extraMetadata,
	text,
	namePrefix,
	network,
	gif,
} = require(`${basePath}/src/config.js`);

// setup two canvas contexts - one for main img and one for cutout img
const canvas = createCanvas(format.width, format.height);
const canvasCutout = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
const ctxCutout = canvasCutout.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;
ctxCutout.imageSmoothingEnabled = format.smoothing;

var metadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = "-";
const HashlipsGiffer = require(`${basePath}/modules/HashlipsGiffer.js`);

let hashlipsGiffer = null;

const buildSetup = () => {
	if (fs.existsSync(buildDir)) {
		fs.rmdirSync(buildDir, { recursive: true });
	}
	fs.mkdirSync(buildDir);
	fs.mkdirSync(`${buildDir}/json`);
	fs.mkdirSync(`${buildDir}/images`);
	fs.mkdirSync(`${buildDir}/cutouts`);
	if (gif.export) {
		fs.mkdirSync(`${buildDir}/gifs`);
	}
};

const getRarityWeight = _str => {
	let nameWithoutExtension = _str.slice(0, -4);
	var nameWithoutWeight = Number(
		nameWithoutExtension.split(rarityDelimiter).pop()
	);
	if (isNaN(nameWithoutWeight)) {
		nameWithoutWeight = 1;
	}
	return nameWithoutWeight;
};

const cleanDna = _str => {
	const withoutOptions = removeQueryStrings(_str);
	var dna = Number(withoutOptions.split(":").shift());
	return dna;
};

const cleanName = _str => {
	let nameWithoutExtension = _str.slice(0, -4);
	var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
	return nameWithoutWeight;
};

const getElements = path => {
	return fs
		.readdirSync(path)
		.filter(item => !/(^|\/)\.[^\/\.]/g.test(item))
		.map((i, index) => {
			return {
				id: index,
				name: cleanName(i),
				filename: i,
				path: `${path}${i}`,
				weight: getRarityWeight(i),
			};
		});
};

const layersSetup = layersOrder => {
	const layers = layersOrder.map((layerObj, index) => ({
		id: index,
		elements: getElements(`${layersDir}/${layerObj.name}/`),
		name:
			layerObj.options?.["displayName"] != undefined
				? layerObj.options?.["displayName"]
				: layerObj.name,
		blend:
			layerObj.options?.["blend"] != undefined
				? layerObj.options?.["blend"]
				: "source-over",
		opacity:
			layerObj.options?.["opacity"] != undefined
				? layerObj.options?.["opacity"]
				: 1,
		bypassDNA:
			layerObj.options?.["bypassDNA"] !== undefined
				? layerObj.options?.["bypassDNA"]
				: false,
	}));
	return layers;
};

const saveImage = _editionCount => {
	fs.writeFileSync(
		`${buildDir}/images/${_editionCount}.png`,
		canvas.toBuffer("image/png")
	);
};

const saveCutoutImage = _editionCount => {
	fs.writeFileSync(
		`${buildDir}/cutouts/${_editionCount}.png`,
		canvasCutout.toBuffer("image/png")
	);
};

const genColor = () => {
	let hue = Math.floor(Math.random() * 360);
	let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
	return pastel;
};

const drawBackground = () => {
	ctx.fillStyle = background.static ? background.default : genColor();
	ctx.fillRect(0, 0, format.width, format.height);
};

function getRandomNum(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addMetadata = (_dna, _edition) => {
	// ---------------------------------------- METADATA TWEAKS DOWN HERE

	let attrObj = {};
	for (attr of attributesList) {
		const attrName = attr.trait_type;

		attrObj[attrName.toLowerCase()] = attr.value.toLowerCase();
	}

	const { type, zombie, ape, alien } = attrObj;

	let larvaType;
	let statPool;

	if (!!alien) {
		larvaType = alien;
		statPool = 13;
	} else if (!!ape) {
		larvaType = ape;
		statPool = 12;
	} else if (!!zombie) {
		larvaType = zombie;
		statPool = 11;
	} else {
		larvaType = type;
		statPool = 10;
	}

	const statMap = new Array(5).fill(1);

	for (let i = 0; i < statPool; i++) {
		const randomStat = getRandomNum(0, 4);
		if (statMap[randomStat] < 5) {
			statMap[randomStat] += 1;
		} else {
			continue;
		}
	}

	const stats = {
		type: larvaType,
		slime: statMap[0],
		speed: statMap[1],
		spice: statMap[2],
		stealth: statMap[3],
		stink: statMap[4],
	};

	// hook intercept the attributes and add custom hardcoded ones
	const attributes = [
		...attributesList,
		{
			trait_type: "Slime",
			value: stats.slime,
			max_value: 5,
		},
		{
			trait_type: "Speed",
			value: stats.speed,
			max_value: 5,
		},
		{
			trait_type: "Spice",
			value: stats.spice,
			max_value: 5,
		},
		{
			trait_type: "Stealth",
			value: stats.stealth,
			max_value: 5,
		},
		{
			trait_type: "Stink",
			value: stats.stink,
			max_value: 5,
		},
	];

	let tempMetadata = {
		edition: _edition,
		name: `${namePrefix} #${_edition}`,
		description: description,
		image: `${baseUri}/${_edition}.png`,
		dna: sha1(_dna),
		lucky_number: getRandomNum(1, 100),
		stats,
		attributes,
		derived_from: [
			{
				name: "mfers",
				network: "Ethereum",
				src: "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
			},
			{
				name: "Larva Lads",
				network: "Ethereum",
				src: "0x5755Ab845dDEaB27E1cfCe00cd629B2e135Acc3d",
			},
		],
	};

	// ---------------------------------------- ^ METADATA TWEAKS UP HERE

	metadataList.push(tempMetadata);
	attributesList = [];
};

const addAttributes = _element => {
	let selectedElement = _element.layer.selectedElement;
	attributesList.push({
		trait_type: _element.layer.name,
		value: selectedElement.name,
	});
};

const loadLayerImg = async _layer => {
	return new Promise(async resolve => {
		const image = await loadImage(`${_layer.selectedElement.path}`);
		resolve({ layer: _layer, loadedImage: image });
	});
};

const addText = (_sig, x, y, size) => {
	ctx.fillStyle = text.color;
	ctx.font = `${text.weight} ${size}pt ${text.family}`;
	ctx.textBaseline = text.baseline;
	ctx.textAlign = text.align;
	ctx.fillText(_sig, x, y);
};

const drawElement = (_renderObject, _index, _layersLen) => {
	ctx.globalAlpha = _renderObject.layer.opacity;
	ctx.globalCompositeOperation = _renderObject.layer.blend;
	text.only
		? addText(
				`${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
				text.xGap,
				text.yGap * (_index + 1),
				text.size
		  )
		: ctx.drawImage(
				_renderObject.loadedImage,
				0,
				0,
				format.width,
				format.height
		  );

	addAttributes(_renderObject);
};

const drawCutoutElement = (_renderObject, _index, _layersLen) => {
	ctxCutout.globalAlpha = _renderObject.layer.opacity;
	ctxCutout.globalCompositeOperation = _renderObject.layer.blend;
	ctxCutout.drawImage(
		_renderObject.loadedImage,
		0,
		0,
		format.width,
		format.height
	);
};

const constructLayerToDna = (_dna = "", _layers = []) => {
	let mappedDnaToLayers = _layers.map((layer, index) => {
		let selectedElement = layer.elements.find(
			e => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
		);
		return {
			name: layer.name,
			blend: layer.blend,
			opacity: layer.opacity,
			selectedElement: selectedElement,
		};
	});
	return mappedDnaToLayers;
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = _dna => {
	const dnaItems = _dna.split(DNA_DELIMITER);
	const filteredDNA = dnaItems.filter(element => {
		const query = /(\?.*$)/;
		const querystring = query.exec(element);
		if (!querystring) {
			return true;
		}
		const options = querystring[1].split("&").reduce((r, setting) => {
			const keyPairs = setting.split("=");
			return { ...r, [keyPairs[0]]: keyPairs[1] };
		}, []);

		return options.bypassDNA;
	});

	return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = _dna => {
	const query = /(\?.*$)/;
	return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
	const _filteredDNA = filterDNAOptions(_dna);
	return !_DnaList.has(_filteredDNA);
};

const createDna = _layers => {
	let randNum = [];
	_layers.forEach(layer => {
		var totalWeight = 0;
		layer.elements.forEach(element => {
			totalWeight += element.weight;
		});
		// number between 0 - totalWeight
		let random = Math.floor(Math.random() * totalWeight);
		for (var i = 0; i < layer.elements.length; i++) {
			// subtract the current weight from the random weight until we reach a sub zero value.
			random -= layer.elements[i].weight;
			if (random < 0) {
				return randNum.push(
					`${layer.elements[i].id}:${layer.elements[i].filename}${
						layer.bypassDNA ? "?bypassDNA=true" : ""
					}`
				);
			}
		}
	});
	return randNum.join(DNA_DELIMITER);
};

const writeMetaData = _data => {
	fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = _editionCount => {
	let metadata = metadataList.find(meta => meta.edition == _editionCount);
	debugLogs
		? console.log(
				`Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
		  )
		: null;
	fs.writeFileSync(
		`${buildDir}/json/${_editionCount}.json`,
		JSON.stringify(metadata, null, 2)
	);
};

function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

const startCreating = async () => {
	let layerConfigIndex = 0;
	let editionCount = 1;
	let failedCount = 0;
	let abstractedIndexes = [];
	for (
		let i = network == NETWORK.sol ? 0 : 1;
		i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
		i++
	) {
		abstractedIndexes.push(i);
	}
	if (shuffleLayerConfigurations) {
		abstractedIndexes = shuffle(abstractedIndexes);
	}
	debugLogs
		? console.log("Editions left to create: ", abstractedIndexes)
		: null;
	while (layerConfigIndex < layerConfigurations.length) {
		const layers = layersSetup(
			layerConfigurations[layerConfigIndex].layersOrder
		);
		while (
			editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
		) {
			let newDna = createDna(layers);
			if (isDnaUnique(dnaList, newDna)) {
				let results = constructLayerToDna(newDna, layers);

				// MAIN IMAGE
				let loadedElements = [];

				// ALT CUTOUT IMAGE
				let loadedElementsCutout = [];

				results.forEach(layer => {
					// load all layers except the background to the no-bg cutout version
					if (layer.name !== "Background") {
						loadedElementsCutout.push(loadLayerImg(layer));
					}
					// load layers into main display image
					loadedElements.push(loadLayerImg(layer));
				});

				// CREATE MAIN DISPLAY IMAGE
				await Promise.all(loadedElements).then(renderObjectArray => {
					debugLogs ? console.log("Clearing canvas") : null;
					ctx.clearRect(0, 0, format.width, format.height);
					if (gif.export) {
						hashlipsGiffer = new HashlipsGiffer(
							canvas,
							ctx,
							`${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
							gif.repeat,
							gif.quality,
							gif.delay
						);
						hashlipsGiffer.start();
					}
					if (background.generate) {
						drawBackground();
					}
					renderObjectArray.forEach((renderObject, index) => {
						drawElement(
							renderObject,
							index,
							layerConfigurations[layerConfigIndex].layersOrder.length
						);
						if (gif.export) {
							hashlipsGiffer.add();
						}
					});
					if (gif.export) {
						hashlipsGiffer.stop();
					}
					debugLogs
						? console.log("Editions left to create: ", abstractedIndexes)
						: null;
					saveImage(abstractedIndexes[0]);
					addMetadata(newDna, abstractedIndexes[0]);
					saveMetaDataSingleFile(abstractedIndexes[0]);
					console.log(
						`Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
							newDna
						)}`
					);
				});

				// CREATE SECONDARY CUTOUT IMAGE
				await Promise.all(loadedElementsCutout).then(renderObjectArray => {
					ctxCutout.clearRect(0, 0, format.width, format.height);
					renderObjectArray.forEach((renderObject, index) => {
						drawCutoutElement(
							renderObject,
							index,
							layerConfigurations[layerConfigIndex].layersOrder.length
						);
					});
					saveCutoutImage(abstractedIndexes[0]);
					console.log(`Created cutout for #${abstractedIndexes[0]}`);
				});

				dnaList.add(filterDNAOptions(newDna));
				editionCount++;
				abstractedIndexes.shift();
			} else {
				console.log("DNA exists!");
				failedCount++;
				if (failedCount >= uniqueDnaTorrance) {
					console.log(
						`You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
					);
					process.exit();
				}
			}
		}
		layerConfigIndex++;
	}
	writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };
