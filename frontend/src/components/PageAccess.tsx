let contentSupporterValue: string | undefined;
let supporterArrayValue: string[] | undefined;

// This function checks access and sends the result back to the ContentPage
const checkPageAccess = async (callback: (accessGranted: boolean) => void) => {
  if (contentSupporterValue && supporterArrayValue) {

    // Check if contentSupporter is in supporterArray
    const accessGranted = supporterArrayValue.includes(contentSupporterValue);
    
    if (accessGranted) {
      console.log(`${contentSupporterValue} is in the supporterArray! Access granted.`);
    } else {
      console.log(`${contentSupporterValue} is NOT in the supporterArray! Access denied.`);
    }

    // Send the accessGranted result back to the component via callback
    callback(accessGranted);
  } else {
    console.log("Waiting for both values to be provided...");
  }
};

export const setContentSupporter = (contentSupporter: string) => {
  contentSupporterValue = contentSupporter;
};

// This now accepts a callback to send the accessGranted flag back
export const setSupporterArray = (supporterArray: string[], callback: (accessGranted: boolean) => void) => {
  supporterArrayValue = supporterArray;
  checkPageAccess(callback); // Pass the callback to checkPageAccess
};