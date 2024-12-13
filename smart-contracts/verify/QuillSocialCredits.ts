module.exports = [
    "Quill Social Credits", // token name
    "QUILL", // token symbol
    process.env.UP_ADDR, // token owner
    0, // token type = TOKEN
    false, // isNonDivisible?
  ];


  //npx hardhat verify 0x04e88e1b017baf2f2a15468b2a567a20f81c64b8 --constructor-args ./verify/QuillSocialCredits.ts --network luksoTestnet
  //npx hardhat verify 0xce757ca20501b6036bfda92317b3e7227884eeef --constructor-args ./verify/QuillSocialCredits.ts --network luksoMainnet