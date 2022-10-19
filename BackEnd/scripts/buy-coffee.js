const hre = require("hardhat");

//* Returns the Ether Balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//* Logs the Ether Balance for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} | balance: `, await getBalance(address));
    idx++;
  }
}

//* Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  //* Get example accounts
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  //* Get the contract to deploy & deploy
  const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffe");
  const buyMeACoffe = await BuyMeACoffe.deploy();
  await buyMeACoffe.deployed();
  console.log("BuyMeACoffe deployed to: ", buyMeACoffe.address);

  //* Check balances before the coffee purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffe.address];
  console.log("== start ==");
  await printBalances(addresses);

  //* Buy the owner a few coffess
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffe
    .connect(tipper1)
    .buyCoffee("Guille", "Ahi te va tu primer cafe", tip);
  await buyMeACoffe
    .connect(tipper2)
    .buyCoffee("Carlos", "Ahi te va tu segundo cafe", tip);
  await buyMeACoffe
    .connect(tipper3)
    .buyCoffee("Juan", "Ahi te va tu tercer cafe", tip);

  //* Check balances after coffee purchase
  console.log("== bought coffee ==");
  await printBalances(addresses);

  //* Withdraw funds
  await buyMeACoffe.connect(owner).withdrawTips();

  //* Check balance after withdraw
  console.log("== withdraw tips ==");
  await printBalances(addresses);

  //* Read all the memos left for the owner
  console.log("== memos ==");
  const memos = await buyMeACoffe.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });