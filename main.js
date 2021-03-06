const SHA256 = require("crypto-js/sha256");

class Block {
	constructor(index, timestamp, data, previousHash = "") {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.previousHash +
				this.timestamp +
				JSON.stringify(this.data) +
				this.nonce
		).toString();
	}

	mineBlock(difficulty) {
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0") // Making sure the beginning of the string up to the difficulty amount is "0".
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("Block mined: " + this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 5; // How many zeroes are needed at the beginning of the hash for the block to be valid.
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2021", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		//newBlock.hash = newBlock.calculateHash();
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		return true;
	}
}

let zivizCoin = new Blockchain();

console.log("Minings block 1...");
zivizCoin.addBlock(new Block(1, "28/11/2021", { amount: 5 }));

console.log("Minings block 2...");
zivizCoin.addBlock(new Block(2, "29/11/2021", { amount: 12 }));
