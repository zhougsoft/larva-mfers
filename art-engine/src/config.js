const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = 'larva mfer';
const description =
	'Larva Mfers are a play on mfers, Larva Lads, and everything they were a play on as well. This project is in the public domain, feel free to use Larva Mfers in any way you want.';
const baseUri = 'ipfs://REPLACE';

// OPTIONAL: Metadata only applied if Solana network is selected
const solanaMetadata = {};


// CALCULATIN THE BULLSHAT

// 10k

const TOTAL_COMMONS = 500; // how many commons will exist
const COMMONS_MAGICS = 100; // how many commons will be "magic"

const TOTAL_ZOMBIES = 0; // how many zombies will exist
const ZOMBIES_MAGICS = 0; // how many zombies will be "magic"

const TOTAL_APES = 0; // how many apes will exist
const APES_MAGICS = 0; // how many apes will be "magic"

const TOTAL_ALIENS = 0; // how many aliens will exist
const ALIENS_MAGICS = 0; // how many aliens will be "magic"


const half = num => Math.round(num / 2);
const quarter = num => Math.round(num / 4);

const TOTAL_RUN_AMOUNT = TOTAL_COMMONS + TOTAL_ZOMBIES + TOTAL_APES + TOTAL_ALIENS;


// FULL DISCLOSURE, NO IDEA WHAT I WAS THINKING WHEN I DID THIS, BUT IT WORKS. SO YEAH...

const COMMONS_AMT1 = half(TOTAL_COMMONS);
const COMMONS_MAGIC1 = COMMONS_AMT1 + half(COMMONS_MAGICS);
const COMMONS_MAGIC2 = COMMONS_MAGIC1 + half(COMMONS_MAGICS);
const COMMONS_AMT2 = TOTAL_COMMONS;

const ZOMBIES_AMT1 = TOTAL_COMMONS + half(TOTAL_ZOMBIES);
const ZOMBIES_MAGIC1 = ZOMBIES_AMT1 + half(ZOMBIES_MAGICS);
const ZOMBIES_MAGIC2 = ZOMBIES_MAGIC1 + half(ZOMBIES_MAGICS);
const ZOMBIES_AMT2 = TOTAL_ZOMBIES + TOTAL_COMMONS;

const APES_AMT1 = ZOMBIES_AMT2 + half(TOTAL_APES);
const APES_MAGIC1 = APES_AMT1 + half(APES_MAGICS);
const APES_MAGIC2 = APES_MAGIC1 + half(APES_MAGICS);
const APES_AMT2 = TOTAL_APES + TOTAL_COMMONS + TOTAL_ZOMBIES;

const ALIENS_AMT1 = APES_AMT2 + half(TOTAL_ALIENS);
const ALIENS_MAGIC1 = ALIENS_AMT1 + half(ALIENS_MAGICS);
const ALIENS_MAGIC2 = ALIENS_MAGIC1 + half(ALIENS_MAGICS);
const ALIENS_AMT2 = TOTAL_RUN_AMOUNT;

// ^ NOT TOUCHING IT LOL.



const layerConfigurations = [
	// --- COMMONS ---

	// commons w/ hair & headphones
	{
		growEditionSizeTo: COMMONS_AMT1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Type' },
			{ name: 'Outline' },
			{ name: 'Mouth' },
			{ name: 'Eyewear' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Smoke' },
		],
	},
	// magic commons w/ hair & headphones
	{
		growEditionSizeTo: COMMONS_MAGIC1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Type' },
			{ name: 'Outline' },
			{ name: 'AltMouth' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Magic' },
		],
	},
	// magic commons w/ headware
	{
		growEditionSizeTo: COMMONS_MAGIC2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Type' },
			{ name: 'Outline' },
			{ name: 'AltMouth' },
			{ name: 'Earring' },
			{ name: 'Headwear' },
			{ name: 'Magic' },
		],
	},
	// commons w/ headware
	{
		growEditionSizeTo: COMMONS_AMT2,
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

	//--- ZOMBIES ---

	// zombies w/ hair & headphones
	{
		growEditionSizeTo: ZOMBIES_AMT1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Zombie' },
			{ name: 'Outline' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Smoke' },
		],
	},
	// magic zombies w/ hair & headphones
	{
		growEditionSizeTo: ZOMBIES_MAGIC2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Zombie' },
			{ name: 'Outline' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Magic' },
		],
	},
	// magic zombies w/ headware
	{
		growEditionSizeTo: ZOMBIES_MAGIC2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Zombie' },
			{ name: 'Outline' },
			{ name: 'Headwear' },
			{ name: 'Earring' },
			{ name: 'Magic' },
		],
	},
	// zombies w/ headware
	{
		growEditionSizeTo: ZOMBIES_AMT2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Zombie' },
			{ name: 'Outline' },
			{ name: 'Headwear' },
			{ name: 'Earring' },
			{ name: 'Smoke' },
		],
	},

	// --- APES ---

	// apes w/ hair & headphones
	{
		growEditionSizeTo: APES_AMT1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Ape' },
			{ name: 'Outline' },
			{ name: 'Eyewear' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
		],
	},
	// magic apes w/ hair & headphones
	{
		growEditionSizeTo: APES_MAGIC1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Ape' },
			{ name: 'Outline' },
			{ name: 'Eyewear' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
		],
	},
	// magic apes w/ headware
	{
		growEditionSizeTo: APES_MAGIC2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Ape' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Eyewear' },
			{ name: 'Headwear' },
		],
	},
	// apes w/ headware
	{
		growEditionSizeTo: APES_AMT2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Ape' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Eyewear' },
			{ name: 'Headwear' },
		],
	},

	// --- ALIENS ---

	// aliens /w hair & headphones
	{
		growEditionSizeTo: ALIENS_AMT1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Alien' },
			{ name: 'Outline' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Smoke' },
		],
	},
	// magic aliens /w hair & headphones
	{
		growEditionSizeTo: ALIENS_MAGIC1,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Alien' },
			{ name: 'Outline' },
			{ name: 'Hair' },
			{ name: 'Headphones' },
			{ name: 'Magic' },
		],
	},
	// magic aliens /w headware
	{
		growEditionSizeTo: ALIENS_MAGIC2,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Alien' },
			{ name: 'Outline' },
			{ name: 'Earring' },
			{ name: 'Headwear' },
			{ name: 'Magic' },
		],
	},
	// aliens /w headware
	{
		growEditionSizeTo: ALIENS_AMT2,
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
