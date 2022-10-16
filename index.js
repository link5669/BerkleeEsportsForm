const Discord = require('discord.js');
const EmbedBuilder = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
client.login('TOKEN');
let initmsg
var database = new Map()

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
index = 235
var timeout = "60000"
var silent = false

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

client.on('message', msg => {
  console.log("asd")
  initmsg = msg
  if (msg.content.includes("!mingus help")) {
    initmsg.channel.send("Welcome to MingusBot! \n\n\n *add ! to the start of every command!*\n\n **build database** should be run when MingusBot is first configured, this command indexes every user's first entry in the Google form into a local database for fewer API calls\n    NOTE: set 'silent=false' for verbose output for database initialization, or set 'silent=true' for fewer messages\n\n **get email** *studentID* gets the student's email\n\n **get id** *student first name or last name* gets all possible results for a student's id\n    NOTE: get id is case insensitive!")
  }
  if (msg.content.includes("silent=true")) {
    silent = true
  }
  if (msg.content.includes("silent=false")) {
    silent = false
  }
  if (msg.content.includes("!start")) {
    console.log("asd")
    authorize().then(getData).catch(console.error);
  }
  if (msg.content.includes("!build database")) {
    timeout = "1000"
    buildDatabase()
  }
  if (msg.content.includes("!get email")) {
    console.log(msg.content.length)
    if (msg.content.length == 20) {
      var id = msg.content.substring(11)
      initmsg.channel.send(database.get(id).getEmail())
    } else if (msg.content.length == 18) {
      var id = msg.content.substring(11)
      initmsg.channel.send(database.get(id).getEmail())
    }
  }
  if (msg.content.includes("!get id")) {
    initmsg.channel.send("POSSIBLE MATCHES:")
    database.forEach (function(value, key) {
      if (value.fname.toLowerCase() == msg.content.substring(8)) {
        initmsg.channel.send(value.fname + " " + value.lname + ": " + value.id)
      } else if (value.lname.toLowerCase() == msg.content.substring(8)) {
        initmsg.channel.send(value.fname + " " + value.lname + ": " + value.id)
      }
    })
  }
});

function buildDatabase() {
    index = 241
    authorize().then(getData).catch(console.error);
}

class User {
  constructor (fname, lname, email, id, discord) {
    this.fname = fname
    this.lname = lname
    this.email = email
    this.id = id
    this.discord = discord
  }
  getEmail() {
    return this.email
  }
}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

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

async function getData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1lXznA2IQjjVTFfS1Px-Z5_Z_vRHKPXsaa8JhEZz-3U8',
    range: index + ':' + index,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    // console.log('No new data found.');
    timeout = "60000"
    // initmsg.channel.send('No new data found')
    setTimeout(() => {
      authorize().then(getData).catch(console.error);
    }, timeout)
    return;
  }
  rows.forEach((row) => {
    // initmsg.channel.send('Found data!')
    var fname
    var lname
    if (row[1] == "Yes") {
      fname = row[12]
      lname = row[13]
      id = row[14]
    } else {
      fname = row[2]
      lname = row[3]
      id = row[7]
      database.set(id, new User(fname, lname, row[4], id, row[5]))
    }
    if (silent) {
      const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(row[0] + " " + fname + " " + lname + " has registered for the club!")
	// .setURL('https://discord.js.org/')
	// .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription("> Email: " + row[4] + "\n> Discord: " + row[5])
	// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

channel.send({ embeds: [exampleEmbed] });
      initmsg.channel.send(fname + " " + lname + " registered on " + `${row[0]}`)
    }
    console.log(`${row[0]}`);
    index += 1
    setTimeout(() => {
      authorize().then(getData).catch(console.error);
    }, timeout)
  });
}
