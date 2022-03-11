const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "larva mfer";
const description =
	"Larva Mfers are a play on mfers, Larva Lads, and everything they were a play on as well. This project is in the public domain, feel free to use Larva Mfers in any way you want.";
const baseUri = "ipfs://REPLACE";

// PROD - TOTAL SUPPLY: 6699
const TOTAL_COMMONS = 5699; // how many commons will exist
const TOTAL_ZOMBIES = 500; // how many zombies will exist
const TOTAL_APES = 450; // how many apes will exist
const TOTAL_ALIENS = 50; // how many aliens will exist


// debug size
// const TOTAL_COMMONS = 15;
// const TOTAL_ZOMBIES = 5;
// const TOTAL_APES = 5;
// const TOTAL_ALIENS = 5;

const half = num => Math.round(num / 2);
const quarter = num => Math.round(num / 4);

const TOTAL_RUN_AMOUNT =
	TOTAL_COMMONS + TOTAL_ZOMBIES + TOTAL_APES + TOTAL_ALIENS;

const COMMONS_AMT1_ALT = quarter(TOTAL_COMMONS);
const COMMONS_AMT1 = half(TOTAL_COMMONS);
const COMMONS_AMT2_ALT = quarter(TOTAL_COMMONS);
const COMMONS_AMT2 = TOTAL_COMMONS;
const ZOMBIES_AMT1 = TOTAL_COMMONS + half(TOTAL_ZOMBIES);
const ZOMBIES_AMT2 = TOTAL_ZOMBIES + TOTAL_COMMONS;
const APES_AMT1 = ZOMBIES_AMT2 + half(TOTAL_APES);
const APES_AMT2 = TOTAL_APES + TOTAL_COMMONS + TOTAL_ZOMBIES;
const ALIENS_AMT1 = APES_AMT2 + half(TOTAL_ALIENS);
const ALIENS_AMT2 = TOTAL_RUN_AMOUNT;

const BACKGROUND_LAYER = {
	name: "Background",
	options: {
		bypassDNA: true,
	},
};

const OUTLINE_LAYER = {
	name: "Outline",
	options: {
		bypassDNA: true,
	},
};

const SPECIAL_MOUTH = {
	name: "SpecialMouth",
	options: { displayName: "Mouth" },
};

const layerConfigurations = [
	// --- COMMONS ---
	// commons w/ hair & headphones - ALT TRAITS
	{
		growEditionSizeTo: COMMONS_AMT1_ALT,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Type" },
			OUTLINE_LAYER,
			SPECIAL_MOUTH,
			{ name: "Eyewear" },
			{ name: "Hair" },
			{ name: "Headphones" },
		],
	},
	// commons w/ hair & headphones
	{
		growEditionSizeTo: COMMONS_AMT1,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Type" },
			OUTLINE_LAYER,
			{ name: "Mouth" },
			{ name: "Eyewear" },
			{ name: "Hair" },
			{ name: "Headphones" },
			{ name: "Smoke" },
		],
	},
	// commons w/ headware - ALT TRAITS
	{
		growEditionSizeTo: COMMONS_AMT2_ALT,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Type" },
			OUTLINE_LAYER,
			SPECIAL_MOUTH,
			{ name: "Earring" },
			{ name: "Eyewear" },
			{ name: "Headwear" },
		],
	},
	// commons w/ headware
	{
		growEditionSizeTo: COMMONS_AMT2,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Type" },
			OUTLINE_LAYER,
			{ name: "Mouth" },
			{ name: "Earring" },
			{ name: "Eyewear" },
			{ name: "Headwear" },
			{ name: "Smoke" },
		],
	},

	//--- ZOMBIES ---
	// zombies w/ hair & headphones
	{
		growEditionSizeTo: ZOMBIES_AMT1,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Zombie" },
			OUTLINE_LAYER,
			{ name: "Hair" },
			{ name: "Headphones" },
			{ name: "Smoke" },
		],
	},
	// zombies w/ headware
	{
		growEditionSizeTo: ZOMBIES_AMT2,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Zombie" },
			OUTLINE_LAYER,
			{ name: "Headwear" },
			{ name: "Earring" },
			{ name: "Smoke" },
		],
	},

	// --- APES ---
	// apes w/ hair & headphones
	{
		growEditionSizeTo: APES_AMT1,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Ape" },
			OUTLINE_LAYER,
			{ name: "Eyewear" },
			{ name: "Hair" },
			{ name: "Headphones" },
		],
	},
	// apes w/ headware
	{
		growEditionSizeTo: APES_AMT2,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Ape" },
			OUTLINE_LAYER,
			{ name: "Earring" },
			{ name: "Eyewear" },
			{ name: "Headwear" },
		],
	},

	// --- ALIENS ---
	// aliens /w hair & headphones
	{
		growEditionSizeTo: ALIENS_AMT1,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Alien" },
			OUTLINE_LAYER,
			{ name: "Hair" },
			{ name: "Headphones" },
			{ name: "Smoke" },
		],
	},
	// aliens /w headware
	{
		growEditionSizeTo: ALIENS_AMT2,
		layersOrder: [
			BACKGROUND_LAYER,
			{ name: "Alien" },
			OUTLINE_LAYER,
			{ name: "Earring" },
			{ name: "Headwear" },
			{ name: "Smoke" },
		],
	},
];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
	width: 500,
	height: 500,
	smoothing: false,
};

const gif = {
	export: false,
	repeat: 0,
	quality: 100,
	delay: 500,
};

const text = {
	only: false,
	color: "#ffffff",
	size: 20,
	xGap: 40,
	yGap: 40,
	align: "left",
	baseline: "top",
	weight: "regular",
	family: "Courier",
	spacer: " => ",
};

const pixelFormat = {
	ratio: 2 / 128,
};

const background = {
	generate: true,
	brightness: "80%",
	static: false,
	default: "#000000",
};

// TODO: generate

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 6699;

const preview = {
	thumbPerRow: 100,
	thumbWidth: 50,
	imageRatio: format.height / format.width,
	imageName: "preview.png",
};

const preview_gif = {
	numberOfImages: 100,
	order: "MIXED", // ASC, DESC, MIXED
	repeat: 0,
	quality: 100,
	delay: 750,
	imageName: "preview.gif",
};

module.exports = {
	format,
	baseUri,
	description,
	background,
	uniqueDnaTorrance,
	layerConfigurations,
	rarityDelimiter,
	preview,
	shuffleLayerConfigurations,
	debugLogs,
	extraMetadata,
	pixelFormat,
	text,
	namePrefix,
	network,
	gif,
	preview_gif,
};
