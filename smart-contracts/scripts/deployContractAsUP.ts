import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// Load environment variables
dotenv.config();

async function deployContract() {
  // UP controller used for deployment
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying contract with Universal Profile controller: ',
    deployer.address,
  );

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDR as string,
  );

  console.log(universalProfile)

  // Create custom bytecode for the contract deployment
  const contractBytecode = (await ethers.getContractFactory('QuillSocialCredits'))
    .bytecode;
  const abiEncoder = new ethers.AbiCoder();

  // Encode constructor parameters
  const encodedConstructorParams = abiEncoder.encode(
    ["string", "string", "address", "uint256", "bool"],
    [
      "Quill Social Credits", // token name
      "QUILL", // token symbol
      process.env.UP_ADDR, // token owner
      0, // token type = TOKEN
      false, // isNonDivisible?
    ]
  );

  // Add the constructor parameters to the contract bytecode
  const contractBytecodeWithConstructor = ethers.concat([
    contractBytecode,
    encodedConstructorParams,
  ]);

  console.log('Encoded constructor parameters and bytecode prepared');

  // Get the address of the custom contract that will be created
  const contractAddress = await universalProfile.execute.staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    contractBytecodeWithConstructor, // Payload of the contract
  );

  console.log('Calculated contract address:', contractAddress);

  // Deploy the contract by the Universal Profile
  const tx = await universalProfile.execute(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    contractBytecodeWithConstructor, // Payload of the contract
  );

  // Wait for the transaction to be included in a block
  await tx.wait();
  console.log('Contract deployed at: ', contractAddress);
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });