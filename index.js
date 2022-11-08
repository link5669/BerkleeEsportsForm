const { Discord, EmbedBuilder, Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages ], partials: [Partials.Channel] });
var databaseFile 

let initmsg
var database = new Map()
var stringToWrite
var written = false
var tempID = 1000

const fs = require('fs').promises;
const fsFile = require('fs');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { send } = require('process');

index = 235
var timeout = "60000"
var silent = false

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
client.once('ready', () => {
  console.log('Ready!');
});
client.on('messageCreate', msg => {
  if (msg.content.includes("!read file")) {
    if (!exists("database.json")) {
      initmsg.channel.send("File not found!")
    } else {
      const readline = require('readline');
      var user_file = './database.json';
      var text = fsFile.readFileSync("./database.json");
      var string = text.toString('utf-8')
      var textByLine = string.split("\n")
      i = 0
      while (i < (textByLine.length -1)) {
        obj = JSON.parse(textByLine[i])
        if (obj.fname == "undefined") {
          continue
        }
        database.set(obj.id, new User(obj.fname, obj.lname, obj.email, obj.id, obj.discord, obj.org))
        i += 1
      }
      initmsg.channel.send("Finished reading!")
    }
    
  }
  if (msg.content.includes("!set channel")) {
    initmsg = msg
    initmsg.channel.send("Set channel!")
  }
  if (msg.content.includes("!silent status")) {
    initmsg.channel.send(silent.toString())
  }
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
    authorize().then(getData).catch(console.error);
  }
  if (msg.content.includes("!build database")) {
    timeout = "1000"
    buildDatabase()
  }
  if (msg.content.includes("!get info")) {
    initmsg.channel.send("POSSIBLE MATCHES:")
    database.forEach (function(value, key) {
      console.log(value.fname)
      if (value.fname != "undefined" && value != undefined && value.fname != undefined) {
        if (value.fname.toLowerCase().includes(msg.content.substring(10))) {
          initmsg.channel.send(value.fname + " " + value.lname + " from " + value.org + ": " + value.id + ", " + value.email + ", " + value.discord)
        } else if (value.lname.toLowerCase().includes(msg.content.substring(10))) {
          initmsg.channel.send(value.fname + " " + value.lname + " from " + value.org + ": " + value.id + ", " + value.email + ", " + value.discord)
        }
      }
    })
  }
});

function buildDatabase() {
    index = 2
    authorize().then(getData).catch(console.error);
}

class User {
  constructor (fname, lname, email, id, discord, org) {
    this.fname = fname
    this.lname = lname
    this.email = email
    this.id = id
    this.discord = discord
    this.org = org
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

async function exists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

function sendEmbed(title, description) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
  initmsg.channel.send({ embeds: [exampleEmbed] });
}

async function getData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1lXznA2IQjjVTFfS1Px-Z5_Z_vRHKPXsaa8JhEZz-3U8',
    range: index + ':' + index,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    timeout = "60000"
    if (!written) {
      fs.writeFile("database.json", stringToWrite)
      written = true
    }
    setTimeout(() => {
      authorize().then(getData).catch(console.error);
    }, timeout)
    return;
  }
  rows.forEach((row) => {
    var fname
    var lname
    if (row[1] == "Yes") {
      fname = row[12]
      lname = row[13]
      id = row[14]
      if (!silent) {
        if (database.get(row[14]) == null) {
          var orgResponse
          if (row[14].toString().length == 7) {
            orgResponse = "ID MATCHES BERKLEE COLLEGE FORMAT"
          } else if (row[14].toString().length == 9) {
            orgResponse = "ID MATCHES BOCO FORMAT"
          } else {
            orgResponse = "ID DOES NOT MATCH EXISTING FORMATS"
          }
          sendEmbed(row[0] + " " + fname + " " + lname + " has registered for the club!\nTHIS USER INDICATED THAT THEY HAVE REGISTERED BEFORE BUT DATA IS NOT IN DATABASE", `> Email:  ${row[15]}\n> Discord: NOT AVAILABLE\n> School/Org: ${orgResponse}\n> Berklee ID: ${row[14]}`)
        } else {
          sendEmbed(row[0] + " " + fname + " " + lname + " has registered for the club!",`> Email:  ${row[15]}\n> Discord: ${database.get(row[14]).discord}\n> School/Org: ${database.get(row[14]).org}\n> School ID: ${row[14]}`)
          if (row[15] != database.get(row[14]).email && row[15] != "") {
            initmsg.channel.send(`Data mismatch for email, user entered ${row[15]}, database contains ${database.get(row[14]).email}`)
          }
          if (fname.toLowerCase != database.get(row[14]).fname.toLowerCase) {
            initmsg.channel.send(`Data mismatch for first name, user entered ${fname}, database contains ${database.get(row[14]).fname}`)
          }
          if (lname.toLowerCase != database.get(row[14]).fname.toLowerCase) {
            initmsg.channel.send(`Data mismatch for last name, user entered ${lname}, database contains ${database.get(row[14]).lname}`)
          }
        }
      }
      
    } else {
      fname = row[2]
      lname = row[3]
      id = row[7]
      if (id == null) {
        id = tempID
        tempID++
      }
      database.set(id, new User(fname, lname, row[4], id, row[5], row[6]))
      stringToWrite += JSON.stringify({
        fname: fname,
        lname: lname,
        email: row[4],
        id: id,
        discord: row[5],
        org: row[6]
      })
      stringToWrite += "\n"
      if (!silent) {
        sendEmbed(row[0] + " " + fname + " " + lname + " has registered for the club!",`> Email:  ${row[4]}\n> Discord: ${row[5]}\n> School/Org: ${row[6]}\n> Berklee ID: ${row[7]}`)
        if (row[10] == null) {
          sendEmbed(row[0] + " " + fname + " " + lname + " has registered before but didn't indicate an event!",`> Email:  ${row[4]}\n> Discord: ${row[5]}\n> School/Org: ${row[6]}\n> Berklee ID: ${row[7]}`)
        } else if (row[10].toLowerCase == "yes") {
          sendEmbed(row[0] + " " + fname + " " + lname + ` has checked in for ${row[16]}!`,`> Email:  ${row[4]}\n> Discord: ${row[5]}\n> School/Org: ${row[6]}\n> Berklee ID: ${row[7]}`)
        }
      }
    }
    
    console.log(`${row[0]}`);
    index += 1
    setTimeout(() => {
      authorize().then(getData).catch(console.error);
    }, timeout)
  });
}

client.login('KEY');
