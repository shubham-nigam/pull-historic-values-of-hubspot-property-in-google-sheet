const HUBSPOT_ACCESS_TOKEN = 'ENTER YOUR PRIVATE APP ACCESS TOKEN';

const PROPERTIES = [
  'Property_1',
  'Property_2',
  'Property_3',
  'Property_4',
];

const SEARCH_PROPERTIES = [
  'Property_3',
];

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('HubSpot Data')
    .addItem('Pull Property History by Email', 'pullPropertyHistoryByEmail')
    .addToUi();
}

function pullPropertyHistoryByEmail() {
  const contacts = searchContactsWithProperties(SEARCH_PROPERTIES);
  Logger.log(`[INFO] Found ${contacts.length} contacts with at least one property set.`);

  if (contacts.length === 0) {
    SpreadsheetApp.getUi().alert('No contacts found with specified properties.');
    return;
  }

  const batchSize = 50; // Max batch size for property history API

  const clearedSheets = {};

  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);
    const emails = batch.map(c => c.properties.email).filter(e => e);

    Logger.log(`[INFO] Processing batch ${Math.floor(i / batchSize) + 1} with size ${emails.length}`);

    const batchResults = batchReadContactsWithHistoryByEmail(emails, PROPERTIES);
    if (!batchResults || batchResults.length === 0) {
      Logger.log(`[WARN] Batch read returned no results for batch index starting at ${i}`);
      continue;
    }

    PROPERTIES.forEach(property => {
      let contactsWithHistory = [];
      batchResults.forEach(contact => {
        const propHistory = contact.propertiesWithHistory && contact.propertiesWithHistory[property];
        if (propHistory && propHistory.length > 0) {
          contactsWithHistory.push({
            email: contact.properties.email || '',
            history: propHistory.map(v => ({
              value: v.value,
              timestamp: v.timestamp,
            })),
          });
        }
      });

      const firstBatch = clearedSheets[property] !== true;
      if (firstBatch) {
        clearedSheets[property] = true;
      }
      Logger.log(`[INFO] Property "${property}": batch has ${contactsWithHistory.length} contacts with history.`);
      writeHistoryToSheet(property, contactsWithHistory, firstBatch);
    });
  }
}

function searchContactsWithProperties(properties) {
  let results = [];
  let after;
  const pageSize = 200;
  let page = 0;

  do {
    const filters = properties.map(p => ({
      propertyName: p,
      operator: 'HAS_PROPERTY',
    }));
    const payload = {
      filterGroups: [{ filters, operator: 'OR' }],
      properties: ['email'],
      limit: pageSize,
      after: after,
    };
    const url = `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`;
    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() !== 200) {
        Logger.log(`[ERROR] Contact search failed: ${response.getContentText()}`);
        break;
      }
      const data = JSON.parse(response.getContentText());
      Logger.log(`[INFO] Page ${++page}: Fetched ${data.results.length} contacts.`);
      if (data.results && data.results.length) {
        results = results.concat(data.results);
        after = data.paging && data.paging.next ? data.paging.next.after : undefined;
      } else {
        after = undefined;
      }
    } catch (err) {
      Logger.log(`[FATAL] Exception during contact search: ${err}`);
      break;
    }
  } while (after);

  Logger.log(`[INFO] Total contacts returned: ${results.length}`);
  return results;
}

function batchReadContactsWithHistoryByEmail(emails, properties) {
  const url = `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/batch/read`;
  const payload = {
    idProperty: 'email',
    inputs: emails.map(email => ({ id: email })),
    properties: ['email', ...properties],
    propertiesWithHistory: properties,
  };

  const options = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() !== 200) {
      Logger.log(`[ERROR] Batch read failed: ${response.getContentText()}`);
      return [];
    }

    const data = JSON.parse(response.getContentText());
    Logger.log(`[INFO] Batch read returned ${data.results ? data.results.length : 0} contacts`);
    return data.results || [];
  } catch (err) {
    Logger.log(`[FATAL] Exception during batch read: ${err}`);
    return [];
  }
}

/**
 * Writes the property history data to Google Sheets.
 * Clears the sheet only for the first batch per property.
 */
function writeHistoryToSheet(propertyName, contacts, firstBatch) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(propertyName);
  if (!sheet) sheet = ss.insertSheet(propertyName);
  if (firstBatch) sheet.clear();

  if (contacts.length === 0) {
    if (firstBatch) sheet.appendRow(['No data found']);
    Logger.log(`[WARN] No history found for property: ${propertyName}`);
    return;
  }

  // Calculate max history length to create columns dynamically
  const maxHistoryLength = Math.max(...contacts.map(c => c.history.length));
  const headers = ['Email'];
  for (let i = 1; i <= maxHistoryLength; i++) {
    headers.push(`Value ${i}`, `Timestamp ${i}`);
  }
  if (firstBatch) sheet.appendRow(headers);

  contacts.forEach(contact => {
    const row = [contact.email];
    contact.history.forEach(h => {
      row.push(h.value || '', new Date(h.timestamp).toLocaleString() || '');
    });
    while (row.length < headers.length) {
      row.push('');
    }
    sheet.appendRow(row);
  });

  Logger.log(`[INFO] Wrote ${contacts.length} rows for property: ${propertyName} (append: ${!firstBatch})`);
}
