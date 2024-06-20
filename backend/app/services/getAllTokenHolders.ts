const getAllTokenHolder = async () => {
  const tokenContractAddress = "0x04e88e1b017baf2f2a15468b2a567a20f81c64b8"; // testnet contract
  const baseUrlTestnet = "https://api.explorer.execution.testnet.lukso.network/api";


 const urlTesting = "https://explorer.execution.testnet.lukso.network/api/v2?module=token&action=getTokenHolders&contractaddress={0x04e88e1b017baf2f2a15468b2a567a20f81c64b8}&page={1}&offset={integer}"


  const url = `${baseUrlTestnet}?module=token&action=tokenHolders&contractaddress=${tokenContractAddress}`;

  try {
      const response = await fetch(urlTesting);
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching token holders:', error);
      throw error;
  }
};

export default getAllTokenHolder