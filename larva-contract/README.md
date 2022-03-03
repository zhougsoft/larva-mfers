# larva mfers

**HARDCODED SECRETS == BAD!**

> if u wanna store secret keys, make a copy of `.env.example` named `.env` and add them! the `.env` file is ignored by Git in this repo thanks to our bro `.gitignore`.

---

- deploy locally: `npm run deploy`
- deploy to rinkeby: `npm run deploy:rinkeby`
- verify with etherscan on rinkeby: `npm run verify:rinkeby`

---

## useful hardhat commands

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
