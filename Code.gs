function doGet() {
  try {
    return HtmlService.createTemplateFromFile('Login')
      .evaluate() // Evaluate the template to process scriptlets
      .setTitle('Order Form')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  } catch (e) {
    return HtmlService.createHtmlOutput(
      'Error loading the Login page: ' + e.message
    );
  }
}

function showPage(username) {
  try {
    var template = HtmlService.createTemplateFromFile('Form');
    template.username = username; // Pass the username to the template, if needed

    return template
      .evaluate() // Evaluate the template to process scriptlets
      .setTitle('Order Form')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent(); // Retrieve the final HTML content
  } catch (e) {
    Logger.log('Error loading the Order Form: ' + e.message); // Log the error
    throw new Error(e.message); // Rethrow the error to the client-side
  }
}

function getUsernames() {
  var spreadSheetId = '1wjHOvrIeGcUSyCJSfIaUjg_nNb36pjpQ5vC4r8wXBjk'; // Spreadsheet ID
  var sheetName = 'Login'; // Sheet name
  var range = sheetName + '!A2:D'; // Adjust the range to include the "Login Type" column

  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;

    var usernames = values
      .filter(function (row) {
        // Check if the username is not empty and the login type is 'Order'
        return row[0] !== '' && row[2] == 'Order' && row[3] == 'TRUE';
      })
      .map(function (row) {
        return row[0];
      });

    usernames.sort();
    return usernames;
  } catch (e) {
    Logger.log('Error fetching usernames: ' + e.toString());
    throw e;
  }
}

function checkLogin(username, password) {
  var spreadSheetId = '1wjHOvrIeGcUSyCJSfIaUjg_nNb36pjpQ5vC4r8wXBjk'; // Spreadsheet ID
  var sheetName = 'Login'; // Sheet name
  var range = sheetName + '!A2:B'; // Adjust the range to include all necessary columns

  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;

    var isValid = values.some(function (row) {
      // Check if username, password match and if the user is of 'Order' type and enabled
      return row[0] == username && row[1] == password;
    });

    if (!isValid) {
      throw new Error('Invalid password. Please enter the correct password.');
    }

    return isValid;
  } catch (e) {
    Logger.log('Error in checkLogin: ' + e.toString());
    throw e;
  }
}

function fetchUIDs() {
  var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Spreadsheet ID
  var sheetName = 'OrderData'; // Sheet name
  var range = sheetName + '!A2:B'; // Adjust the range as needed

  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;
    var uniqueUIDs = new Set();

    values.forEach((row) => {
      const [uid, status] = row;
      if ((status === 'N' || status === 'U') && uid) {
        uniqueUIDs.add(uid);
      }
    });

    return Array.from(uniqueUIDs).sort();
  } catch (e) {
    Logger.log('Error fetching UIDs: ' + e.toString());
    throw e;
  }
}

function getClientAreaPairs() {
  var spreadSheetId = '1bCeLeKUjgk2aATV5maK8_9qRKD9lA-eP0g6u9OhdFFY'; // Spreadsheet ID
  var sheetName = 'ClientData'; // Sheet name
  var range = sheetName + '!D2:E'; // Adjust the range as needed

  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;
    var clientAreaPairs = {};

    values.forEach((row) => {
      // Check if row has both client and area data before calling trim
      var client = row[0] ? row[0].trim() : '';
      var area = row[1] ? row[1].trim() : '';
      if (client && area) {
        clientAreaPairs[client] = clientAreaPairs[client] || new Set();
        clientAreaPairs[client].add(area);
      }
    });

    var sortedClientAreaPairs = {};
    Object.keys(clientAreaPairs)
      .sort()
      .forEach((client) => {
        sortedClientAreaPairs[client] = Array.from(
          clientAreaPairs[client]
        ).sort();
      });

    return sortedClientAreaPairs;
  } catch (e) {
    Logger.log('Error fetching client area pairs: ' + e.toString());
    throw e;
  }
}

function getDropdownOptions() {
    var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw';
    var sheetName = 'Master';
    var range = sheetName + '!J2:N';

    try {
        var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
        var values = response.values;
        var dropdownOptions = {
          firm: [],
          dealerName: [],
          orderReceivedBy: [],
          paymentTerms: [],
          reasonForPending: []
        };

        values.forEach(function (row) {
          if (row[0] && !dropdownOptions.firm.includes(row[0])) dropdownOptions.firm.push(row[0]);
          if (row[1] && !dropdownOptions.dealerName.includes(row[1])) dropdownOptions.dealerName.push(row[1]);
          if (row[2] && !dropdownOptions.orderReceivedBy.includes(row[2])) dropdownOptions.orderReceivedBy.push(row[2]);
          if (row[3] && !dropdownOptions.paymentTerms.includes(row[3])) dropdownOptions.paymentTerms.push(row[3]);
          if (row[4] && !dropdownOptions.reasonForPending.includes(row[4])) dropdownOptions.reasonForPending.push(row[4]);
        });

        return dropdownOptions;
    } catch (e) {
        Logger.log('Error fetching dropdown options: ' + e.toString());
        throw e;
    }
}

function getItemData() {
  var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Spreadsheet ID
  var sheetName = 'Master'; // Sheet name
  var range = sheetName + '!A2:E'; // Adjust the range as needed

  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;
    var itemData = {};

    values.forEach((row) => {
      var item = row[0];
      var type = row[1];
      var uom = row[2];
      var productId = row[3];

      if (!itemData[item]) {
        itemData[item] = {};
      }
      itemData[item][type] = { uom: uom, productId: productId };
    });

    return itemData;
  } catch (e) {
    Logger.log('Error fetching item data: ' + e.toString());
    throw e;
  }
}

function getGSTData() {
  var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Spreadsheet ID
  var sheetName = 'Master'; // Sheet name
  var range = sheetName + '!G2:H'; // Adjust the range as needed
  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;
    var gstData = {};

    values.forEach(function (row) {
      gstData[row[0]] = row[1]; // Assuming first column is Product ID, second is GST
    });

    return gstData;
  } catch (e) {
    Logger.log('Error fetching GST data: ' + e.toString());
    throw e;
  }
}

function submitData(data) {
  var lock = LockService.getScriptLock();
  try {
    // Check if data is provided and not empty
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No data provided. Please check your input.');
    }

    // Try to acquire a lock for 30 seconds. If unable to get a lock after 30 seconds, throw an exception
    if (!lock.tryLock(30000)) {
      throw new Error('Could not obtain lock after 30 seconds.');
    }
    // Configuration and setup
    var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Spreadsheet ID
    var sheetName = 'OrderData'; // Sheet name
    var activeUser = Session.getActiveUser().getEmail(); // Active user's email
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );

    // ID generation and properties handling
    var scriptProperties = PropertiesService.getScriptProperties();
    var lastUsedId = scriptProperties.getProperty('lastUsedId');
    var lastRowNumber = parseInt(scriptProperties.getProperty('lastRowNumber')) || 0;
    var nStatus = 'N';
    var newId;

    // Generate new ID
    if (lastUsedId == null) {
      newId = 'OF-00001';
    } else {
      var lastIdNumber = parseInt(lastUsedId.substring(3), 10);
      var newIdNumber = lastIdNumber + 1;
      newId = 'OF-' + newIdNumber.toString().padStart(5, '0');
    }

    // Additional check for itemFields
    if (!data.itemFields || data.itemFields.length === 0) {
      throw new Error('No item data provided. Please check your input.');
    }

    // Preparing data for appending
    const itemFields = JSON.parse(data.itemFields);
    var allRowsData = itemFields.map((items) => {
      lastRowNumber += 1;
      return [
        newId,
        nStatus,
        timestamp,
        data.orderNo,
        data.orderInCompany,
        data.partyName,
        data.area,
        data.rPerson,
        data.rDes,
        data.rcNumber,
        data.remailId,
        data.orderDate,
        data.orderRecdDate,
        data.despatchDueDate,
        data.dealerName,
        data.orderReceivedBy,
        data.paymentTerms,
        data.orderValue,
        data.resFPending,
        data.remarks,
        items.srNo,
        items.item,
        items.type,
        items.uom,
        items.productId,
        items.qty,
        items.rate,
        items.disc,
        items.gst,
        items.tAmt,
        items.inst,
        items.cQty,
        items.cReason,
        data.pocopyUrl,
        lastRowNumber,
        data.username,
        activeUser,
      ];
    });

    if (allRowsData.length > 0) {
      var request = {
        values: allRowsData,
      };

      Sheets.Spreadsheets.Values.append(request, spreadSheetId, sheetName + '!A:A', {
        valueInputOption: 'USER_ENTERED',
      });

      // Update lastRowNumber only after successful append operation
      scriptProperties.setProperty('lastUsedId', newId);
      scriptProperties.setProperty('lastRowNumber', lastRowNumber.toString());
      return 'Form successfully submitted! New ID: ' + newId;
    } else {
      throw new Error('No data to submit.');
    }
  } catch (e) {
    // If unable to obtain a lock or any other error, handle the error here
    Logger.log('Error: ' + e.toString());
    throw e; // Rethrow the error for further handling
  } finally {
    // Always release the lock at the end
    lock.releaseLock();
  }
}

function handleFileUploadToDrive(fileData) {
  const driveFolder = DriveApp.getFolderById(
    '1AcRnCuV2z9nltlOjLPfgrzOmP5p3mGyz'
  );
  if (!fileData || !fileData.content) {
    return '';
  }

  var fileContent = Utilities.base64Decode(fileData.content.split(',')[1]);
  var fileBlob = Utilities.newBlob(fileContent, MimeType.PDF, fileData.name);
  var pdfFile = driveFolder.createFile(fileBlob);
  return pdfFile.getUrl();
}

function updateData(data) {
  var lock = LockService.getScriptLock();
  try {
    // Check if data is provided and not empty
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No data provided. Please check your input.');
    }

    // Try to acquire a lock for 30 seconds. If unable to get a lock after 30 seconds, throw an exception
    if (!lock.tryLock(30000)) {
      throw new Error('Could not obtain lock after 30 seconds.');
    }
    // Configuration and setup
    var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Spreadsheet ID
    var sheetName = 'OrderData'; // Sheet name
    var range = sheetName + '!A2:B'; // Adjust the range according to your data
    var activeUser = Session.getActiveUser().getEmail(); // Active user's email
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );
    var uStatus = 'U';

    var scriptProperties = PropertiesService.getScriptProperties();
    var lastRowNumber = parseInt(scriptProperties.getProperty('lastRowNumber')) || 0;

    // Find rows with the UID to mark as deleted
    var uidFound = false;
    var requests = []; // For batch update

    // Fetch data using Sheets API
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;
    // Iterate through the values to collect all update requests
    for (var i = 0; i < values.length; i++) {
      if (
        values[i][0] == data.uid &&
        (values[i][1] == 'N' || values[i][1] == 'U')
      ) {
        uidFound = true;
        var updateRange = sheetName + '!B' + (i + 2); // Adjusting for one-based index
        requests.push({
          range: updateRange,
          values: [['D']], // Update status to 'D'
        });
      }
    }

    if (!uidFound) {
      throw new Error('Order ID not found.');
    }

    // Perform batch update if there are rows to update
    if (requests.length > 0) {
      Sheets.Spreadsheets.Values.batchUpdate(
        {
          data: requests,
          valueInputOption: 'USER_ENTERED',
        },
        spreadSheetId
      );
    }

    // Additional check for itemFields
    if (!data.itemFields || data.itemFields.length === 0) {
      throw new Error('No item data provided. Please check your input.');
    }

    // Preparing data for appending
    const itemFields = JSON.parse(data.itemFields);
    var allRowsData = itemFields.map((items) => {
      var rowNum = items.rowNum ? items.rowNum : (++lastRowNumber).toString();
      return [
        data.uid,
        uStatus,
        timestamp,
        data.orderNo,
        data.orderInCompany,
        data.partyName,
        data.area,
        data.rPerson,
        data.rDes,
        data.rcNumber,
        data.remailId,
        data.orderDate,
        data.orderRecdDate,
        data.despatchDueDate,
        data.dealerName,
        data.orderReceivedBy,
        data.paymentTerms,
        data.orderValue,
        data.resFPending,
        data.remarks,
        items.srNo,
        items.item,
        items.type,
        items.uom,
        items.productId,
        items.qty,
        items.rate,
        items.disc,
        items.gst,
        items.tAmt,
        items.inst,
        items.cQty,
        items.cReason,
        data.pocopyUrl,
        rowNum,
        data.username,
        activeUser,
      ];
    });

    if (allRowsData.length > 0) {
      var request = {
        values: allRowsData,
      };

      Sheets.Spreadsheets.Values.append(request, spreadSheetId, sheetName + '!A:A', {
        valueInputOption: 'USER_ENTERED',
      });

      scriptProperties.setProperty('lastRowNumber', lastRowNumber.toString());
      return 'Form successfully updated for Order ID: ' + data.uid;
    } else {
      throw new Error('No data to update.');
    }
  } catch (e) {
    // If unable to obtain a lock or any other error, handle the error here
    Logger.log('Error: ' + e.toString());
    throw e; // Rethrow the error for further handling
  } finally {
    // Always release the lock at the end
    lock.releaseLock();
  }
}

function handleFileupdateToDrive(fileData) {
  const driveFolder = DriveApp.getFolderById(
    '1AcRnCuV2z9nltlOjLPfgrzOmP5p3mGyz'
  );
  if (!fileData || !fileData.content) {
    return '';
  }

  var fileContent = Utilities.base64Decode(fileData.content.split(',')[1]);
  var fileBlob = Utilities.newBlob(fileContent, MimeType.PDF, fileData.name);
  var pdfFile = driveFolder.createFile(fileBlob);
  return pdfFile.getUrl();
}

function fetchUID(uid) {
  var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Spreadsheet ID
  var sheetName = 'OrderData'; // Sheet name
  var range = sheetName + '!A1:AM'; // Adjust the range as needed

  try {
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;

    var filteredData = values.filter(function (row) {
      // Check if the row matches the UID and status is either 'N' or 'U'
      return row[0] === uid && (row[1] === 'N' || row[1] === 'U');
    });

    if (filteredData.length === 0) {
      throw new Error(
        'No matching data found for the given UID and status conditions.'
      );
    }

    return filteredData.map(function (row) {
      var forderDate = formatDate(new Date(row[11]));
      var forderRecdDate = formatDate(new Date(row[12]));
      var fdespatchDueDate = formatDate(new Date(row[13]));

      return {
        orderNo: row[3],
        orderInCompany: row[4],
        partyName: row[5],
        area: row[6],
        rPerson: row[7],
        rDes: row[8],
        rcNumber: row[9],
        remailId: row[10],
        forderDate,
        forderRecdDate,
        fdespatchDueDate,
        dealerName: row[14],
        orderReceivedBy: row[15],
        paymentTerms: row[16],
        orderValue: row[17],
        resFPending: row[18],
        remarks: row[19],
        srNo: row[20],
        item: row[21],
        type: row[22],
        uom: row[23],
        productId: row[24],
        qty: row[25],
        rate: row[26],
        disc: row[27],
        gst: row[28],
        tAmt: row[29],
        inst: row[30],
        cQty: row[31],
        cReason: row[32],
        dowPO: row[33] ? row[33] : null,
        rowNum: row[34],
        prorow: row[38],
      };
    });
  } catch (e) {
    Logger.log('Error fetching data: ' + e.toString());
    throw e;
  }
}

function formatDate(date) {
  // Format the date as 'yyyy-MM-dd'
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function deleteUid(uid) {
  var lock = LockService.getScriptLock();
  try {
    // Check if data is provided and not empty
    if (!uid) {
      throw new Error('No UID provided. Please check your input.');
    }

    // Try to acquire a lock for 30 seconds. If unable to get a lock after 30 seconds, throw an exception
    if (!lock.tryLock(30000)) {
      throw new Error('Could not obtain lock after 30 seconds.');
    }
    var spreadSheetId = '1lRpkJgloeASU-IRVRqZHr_eQXJuw2sLfoXKPZUGiQtw'; // Replace with your actual Spreadsheet ID
    var sheetName = 'OrderData'; // Change to your actual sheet name
    var range = sheetName + '!A2:B'; // Adjust the range according to your data
    var uidFound = false;
    var requests = []; // To hold batch update requests

    // Fetch data using Sheets API
    var response = Sheets.Spreadsheets.Values.get(spreadSheetId, range);
    var values = response.values;

    // Iterate through the values to collect all update requests
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] == uid && (values[i][1] == 'N' || values[i][1] == 'U')) {
        uidFound = true;
        var updateRange = sheetName + '!B' + (i + 2); // Adjusting for zero-based index and header row
        requests.push({
          range: updateRange,
          values: [['D']], // Update status to 'D'
        });
      }
    }

    if (!uidFound) {
      throw new Error('Order ID not found.');
    }

    // Perform batch update if there are rows to update
    if (requests.length > 0) {
      Sheets.Spreadsheets.Values.batchUpdate(
        {
          data: requests,
          valueInputOption: 'USER_ENTERED',
        },
        spreadSheetId
      );
    }
    return 'Order ID ' + uid + ' has been successfully deleted.';
  } catch (e) {
    Logger.log('Error: ' + e.toString());
    throw e; // Rethrow the error for further handling
  } finally {
    // Always release the lock at the end
    lock.releaseLock();
  }
}
