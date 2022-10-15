const Discord = require('discord.js');
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
client.login('MTAzMDg3MDU3NDYwNTU1MzczNQ.GAuo5m.ywZYD4zrLpSVSYL-GBmk6tzfnndYD3hEYni-Fw');
Discord.Intents.message_content = true
let initmsg

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
index = 243


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

client.on('message', msg => {
  if (msg.content.includes("!start")) {
    console.log("asd")
    initmsg = msg
    authorize().then(getData).catch(console.error);
  }
});

buildDatabase() {

}
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1lXznA2IQjjVTFfS1Px-Z5_Z_vRHKPXsaa8JhEZz-3U8',
    range: index + ':' + index,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No new data found.');
    initmsg.channel.send('No new data found')
    // client.channels.get('958549367416045591d').send('No new data found');
    // message.guild.channels.cache.get('958549367416045591d').send("No new data found")
    setTimeout(() => {
      authorize().then(getData).catch(console.error);
    }, "60000")
    return;
  }
  rows.forEach((row) => {
    initmsg.channel.send('Found data!')
    var fname
    var lname
    if (row[1] == "Yes") {
      fname = row[12]
      lname = row[13]
    } else {
      fname = row[2]
      lname = row[3]
    }
    initmsg.channel.send(fname + " " + lname + " registered on " + `${row[0]}`)
    console.log(`${row[0]}`);
    index += 1
    setTimeout(() => {
      authorize().then(getData).catch(console.error);
    }, "60000")
  });
}
function doSetTimeout() {
  // console.log("2")
  setTimeout(
      function() {
        // console.log("3")
        authorize().then(getData).catch(console.error);
        //  getData(auth)
        }, 5000);
  }
async function getValues(spreadsheetId, range) {
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({version: 'v4', auth});
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const numRows = result.data.values ? result.data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);  
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
