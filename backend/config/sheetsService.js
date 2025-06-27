const { google } = require('googleapis');
const path = require('path');
const sheets = google.sheets('v4');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'ruta/al/archivo-service-account.json'), // reemplaza con la ruta real
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheetData(spreadsheetId, range) {
  const client = await auth.getClient();
  const res = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId,
    range,
  });
  return res.data.values;
}

async function appendToSheet(spreadsheetId, range, values) {
  const client = await auth.getClient();
  const res = await sheets.spreadsheets.values.append({
    auth: client,
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [values],
    },
  });
  return res.data;
}

module.exports = {
  getSheetData,
  appendToSheet,
};
