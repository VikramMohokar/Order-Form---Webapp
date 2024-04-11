function runAllDataImports() {
  Logger.log('Starting all data imports...');

  try {
    // Call each function one after the other
    getSA_FPdata();
    getICdata();
    getProrow(); 

    Logger.log('All data imports completed successfully.');
    return 'All data imports completed successfully.';
  } catch (e) {
    Logger.log('Error during data imports: ' + e.toString());
    throw new Error('Error during data imports: ' + e.toString());
  }
}

function getProrowImports() {
  Logger.log('Starting all data imports...');

  try {
    getProrow(); 
    Logger.log('All data imports completed successfully.');
  } catch (e) {
    Logger.log('Error during data imports: ' + e.toString());
    throw new Error('Error during data imports: ' + e.toString());
  }
}

function getSA_FPdata() {
  Logger.log('Starting batch data import...');
  try {
    // Define source and destination details
    const sourceID = '1FKJUC1H0z_MTrfoQ8lq9swklEKWePJ2dEuiploXgqI8';
    const ranges = ['SA_FP!C3:G']; // Add more ranges as needed
    const destinationID = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw';
    const destinationRangeStart = 'SA_FP!A2:E';

    // Use Sheets API to batch fetch source range values
    const response = Sheets.Spreadsheets.Values.batchGet(sourceID, { ranges: ranges });
    const batchedValues = response.valueRanges[0].values; // Assuming first range in the batch
    const transformedVals = batchedValues.map(row => [row[0], row[1], row[2], row[3], row[4]]);

    const body = {
      valueInputOption: 'USER_ENTERED',
      data: [{
        range: destinationRangeStart,
        values: transformedVals
      }]
    };

    // Prepare the batchClear request
    const clearRequest = {
      ranges: [destinationRangeStart] // Add more ranges if needed
    };

    // Clear the destination range(s) using Sheets API
    Sheets.Spreadsheets.Values.batchClear(clearRequest, destinationID);

    // Perform the batch update
    Sheets.Spreadsheets.Values.batchUpdate(body, destinationID);
    Logger.log('Batch data import completed.');
  } catch (e) {
    Logger.log('Error during batch data import: ' + e.toString());
  }
}

function getICdata() {
  Logger.log('Starting batch data import...');
  try {
    // Define source and destination details
    const sourceID = '1t8Hz8ZvExcmzFDGAMiGpQHwhQ14Tmthv-WIyePFIb-I';
    const ranges = ['IC_data!C3:G']; // Add more ranges as needed
    const destinationID = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw';
    const destinationRangeStart = 'IC!A2:E';

    // Use Sheets API to batch fetch source range values
    const response = Sheets.Spreadsheets.Values.batchGet(sourceID, { ranges: ranges });
    const batchedValues = response.valueRanges[0].values; // Assuming first range in the batch
    const transformedVals = batchedValues.map(row => [row[0], row[1], row[2], row[3], row[4]]);

    const body = {
      valueInputOption: 'USER_ENTERED',
      data: [{
        range: destinationRangeStart,
        values: transformedVals
      }]
    };

    // Prepare the batchClear request
    const clearRequest = {
      ranges: [destinationRangeStart] // Add more ranges if needed
    };

    // Clear the destination range(s) using Sheets API
    Sheets.Spreadsheets.Values.batchClear(clearRequest, destinationID);

    // Perform the batch update
    Sheets.Spreadsheets.Values.batchUpdate(body, destinationID);
    Logger.log('Batch data import completed.');
  } catch (e) {
    Logger.log('Error during batch data import: ' + e.toString());
  }
}

function getProrow() {
  Logger.log('Starting batch data import...');
  try {
    // Define source and destination details
    const sourceID = '1FKJUC1H0z_MTrfoQ8lq9swklEKWePJ2dEuiploXgqI8';
    const ranges = ['reserve!A4:J']; // Add more ranges as needed
    const destinationID = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw';
    const destinationRangeStart = 'pro_row!D2:F';

    // Use Sheets API to batch fetch source range values
    const response = Sheets.Spreadsheets.Values.batchGet(sourceID, { ranges: ranges });
    // Assuming first range in the batch and filtering rows where column H is '-'
    const batchedValues = response.valueRanges[0].values
                          .filter(row => row[9] == null); // Filtering post-fetch
    const transformedVals = batchedValues.map(row => [row[1], row[8], row[9]]);

    const body = {
      valueInputOption: 'USER_ENTERED',
      data: [{
        range: destinationRangeStart,
        values: transformedVals
      }]
    };

    // Prepare the batchClear request
    const clearRequest = {
      ranges: [destinationRangeStart] // Add more ranges if needed
    };

    // Clear the destination range(s) using Sheets API
    Sheets.Spreadsheets.Values.batchClear(clearRequest, destinationID);

    // Perform the batch update
    Sheets.Spreadsheets.Values.batchUpdate(body, destinationID);
    Logger.log('Batch data import completed.');
  } catch (e) {
    Logger.log('Error during batch data import: ' + e.toString());
  }
}
