## larva mfers contract

run a local chain: `npm run chain`
deploy locally: `npm run deploy`
deploy to rinkeby: `npm run deploy:rinkeby`

useful hardhat tasks:

```shell
npx hardhat accounts # displays VM wallet addresses, custom built in hardhat.config.js
npx hardhat compile # compiles artifacts from Solidity contracts
npx hardhat clean # clears out artifacts
npx hardhat test # runs tests in test folder
npx hardhat node # runs the local blockchain VM
npx hardhat help
```

run custom scripts for interacting with the network & contracts:

```shell
node scripts/sample-script.js
```
