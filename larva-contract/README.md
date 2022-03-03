## larva mfers

> if u wanna store secret keys, make a copy of `.env.example` named `.env` and add them! the `.env` file is ignored by Git. **HARDCODED SECRETS == BAD!**

- run a local chain: `npm run chain`
- deploy locally: `npm run deploy`
- deploy to rinkeby: `npm run deploy:rinkeby`

---
### useful hardhat commands
```shell
# compiles artifacts from Solidity contracts
npx hardhat compile

# clears out contract artifacts
npx hardhat clean

# runs all tests in test folder
npx hardhat test

# runs the local virtualized blockchain
npx hardhat node

# display VM wallet addresses (custom built in hardhat.config.js)
npx hardhat accounts

# run custom scripts
npx hardhat run scripts/your-script.js

# get the docs
npx hardhat help
```
