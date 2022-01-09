const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = 'larva mfer';
const description =
	'Larva Mfers are a play on Larva Lads, and everything they were a play on as well. This project is in the public domain; feel free to use Larva Mfers any way you want.';
const baseUri = 'ipfs://REPLACE/';

// OPTIONAL: Metadata only applied if Solana network is selected
const solanaMetadata = {};

const layerConfigurations = [
	// commons w/ hair & headphones
	{
		growEditionSizeTo: 2493,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Type' },
			{ name: 'Outline' },
			{ name: 'Mouth' },
			{ name: 'Earring' },
			{ name: 'Eyewear' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Smoke' },
		],
	},
	// commons w/ headware
	{
		growEditionSizeTo: 4614,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Type' },
			{ name: 'Outline' },
			{ name: 'Mouth' },
			{ name: 'Earring' },
			{ name: 'Eyewear' },
			{ name: 'Headwear' },
			{ name: 'Smoke' },
		],
	},
	// zombies w/ hair & headphones
	{
		growEditionSizeTo: 4701,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Zombie' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Smoke' },
		],
	},
	// zombies w/ headware
	{
		growEditionSizeTo: 4794,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Zombie' },
			{ name: 'Outline' },
			{ name: 'Headwear' },
			{ name: 'Earring' },
			{ name: 'Smoke' },
		],
	},
	// apes w/ hair & headphones
	{
		growEditionSizeTo: 4903,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Ape' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Eyewear' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
		],
	},
	// apes w/ headware
	{
		growEditionSizeTo: 4943,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Ape' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Eyewear' },
			{ name: 'Headwear' },
		],
	},

	// aliens /w hair & headphones
	{
		growEditionSizeTo: 4974,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Alien' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Smoke' },
		],
	},
	// aliens /w headware
	{
		growEditionSizeTo: 5000,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Alien' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Headwear' },
			{ name: 'Smoke' },
		],
	},
];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
	width: 512,
	height: 512,
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
	color: '#ffffff',
	size: 20,
	xGap: 40,
	yGap: 40,
	align: 'left',
	baseline: 'top',
	weight: 'regular',
	family: 'Courier',
	spacer: ' => ',
};

const pixelFormat = {
	ratio: 2 / 128,
};

const background = {
	generate: true,
	brightness: '80%',
	static: false,
	default: '#000000',
};

const extraMetadata = {};

const rarityDelimiter = '#';

const uniqueDnaTorrance = 10000;

const preview = {
	thumbPerRow: 100,
	thumbWidth: 50,
	imageRatio: format.height / format.width,
	imageName: 'preview.png',
};

const preview_gif = {
	numberOfImages: 100,
	order: 'MIXED', // ASC, DESC, MIXED
	repeat: 0,
	quality: 100,
	delay: 750,
	imageName: 'preview.gif',
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
	solanaMetadata,
	gif,
	preview_gif,
};
