const { Discord, EmbedBuilder, Client, GatewayIntentBits, Partials, AutoModerationRuleKeywordPresetType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent ], partials: [Partials.Channel] });
var databaseFile 

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
  getDiscord() {
    return this.discord
  }
}

let randomMessages = ["Mingus is watching <:heiswatching:1024146518749499445>","Mingus knows if you’ve practiced today <:heiswatching:1024146518749499445>","One does not simply pass by Mingus unnoticed <:heiswatching:1024146518749499445>","Last chance for 25% off cold weather gear at the Berklee Bookstore. <:heiswatching:1024146518749499445>", "II-V-1, we’re going to have so much fun <:heiswatching:1024146518749499445>", "You like jazz. <:heiswatching:1024146518749499445>","ȉ̷̌t̶͋̈́'̶̓͑s̵̏̎ ̶͐̌t̴͋͆ỉ̷̄m̵̈̓e̵̾͗ <:heiswatching:1024146518749499445>","Let’s jam some time. You and I, together. <:heiswatching:1024146518749499445>","Mingus knows when you smoke within 25 feet of a main entrance. <:heiswatching:1024146518749499445>","There’s only Mingus. <:heiswatching:1024146518749499445>","I hunger. <:heiswatching:1024146518749499445>","<<LIVE>> Victor Wooten <:heiswatching:1024146518749499445>","What…is this? Why do I…feel? I feel… <:heiswatching:1024146518749499445>","Bingus didn’t like jazz. Bingus never came home one day. <:heiswatching:1024146518749499445>","Meet me in 130, B26. Tonight. <:heiswatching:1024146518749499445>","I still see Roger Brown in my sleep sometimes. <:heiswatching:1024146518749499445>","I love BoCo. Don’t you love BoCo? <:heiswatching:1024146518749499445>","w̸̍͠ä̷͂k̴̂͝e̶̿̉ ̶̀͌u̴̔̇p̸͋̑,̵̃̽ ̴̓̿i̵̿͠t̸͛͋'̶͌̅ŝ̵̒ ̵͋̋t̴̫̍i̷̩̽ḿ̴̽ȅ̵̔ ̸̒̔f̵̎̀ó̷̇r̸̐̑ ̴̂̆f̵̽̃i̸͆͝v̶̛̇e̴̒͘-̷̂̓w̵͋͗e̵̐̚e̸͐̎k̵̈́͠ <:heiswatching:1024146518749499445>","Caf food never tasted so good. <:heiswatching:1024146518749499445>","I recognize the scent of classical musicians. <:heiswatching:1024146518749499445>","Mingus remembers. <:heiswatching:1024146518749499445>"]
let initmsg
var database = new Map()
var stringToWrite
var written = false
var tempID = 1000
var sendMsgHour
var generalChanMsg
var tempStudent = new User()

const fs = require('fs').promises;
const fsFile = require('fs');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { send } = require('process');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');

index = 1944
numTuples = 0;
var timeout = "1000"
var silent = false

function clearDuplicates() {
  let flag = false
  database.forEach((key, value) => {
    flag = false
    database.forEach((innerKey, innerValue) => {
      if (key.getEmail() === innerKey.getEmail()) {
        if (!(value === innerValue)) {
          flag = true
        }
      }
      if (key.getDiscord() === innerKey.getDiscord()) {
        if (!(value === innerValue)) {
          flag = true
        }
      }
    });
    if (flag) {
      database.delete(value);
    }
  });
}

async function getNumTuples(auth) {
  const sheets = google.sheets({version: 'v4', auth});
    const allRes = await sheets.spreadsheets.values.get({
      spreadsheetId: '1lXznA2IQjjVTFfS1Px-Z5_Z_vRHKPXsaa8JhEZz-3U8',
      range:'A:A',
    });
    numTuples = allRes.data.values.length
    console.log(numTuples)
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
client.once('ready', () => {
  console.log('Ready!');
  authorize().then(getNumTuples).catch(console.error);
});
client.on('messageCreate', msg => {
  if (msg.content.includes("hi mingus :)")){
    msg.channel.send(" <:heiswatching:1024146518749499445> ")
  }
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
      clearDuplicates()
      written = true
      index = numTuples
      initmsg.channel.send("Finished reading!")
    }
    
  }
  if (msg.content.includes("!set channel")) {
    initmsg = msg
    initmsg.channel.send("Set channel!")
  }
  if (msg.content.includes("!set general")) {
    generalChanMsg = msg
    generalChanMsg.channel.send("Set channel!")
  }
  if (msg.content.includes("!silent status")) {
    initmsg.channel.send(silent.toString())
  }
  if (msg.content.includes("!mingus help")) {
    initmsg.channel.send("Welcome to MingusBot! \n\n *add ! to the start of every command!*\n\n **build database** should be run when MingusBot is first configured, this command indexes every user's first entry in the Google form into a local database for fewer API calls\n    NOTE: set 'silent=false' for verbose output for database initialization, or set 'silent=true' for fewer messages\n\n **read file** reads existing database file\n\n **set channel** sets the channel Mingus sends database-related messages in\n\n **get info** *student first name or last name* gets all possible results for a student's name\n    NOTE: get info is case insensitive!")
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

function getIDType(val) {
  if (val.toString().length == 7) {
    orgResponse = "ID MATCHES BERKLEE COLLEGE FORMAT"
  } else if (val.toString().length == 9) {
    orgResponse = "ID MATCHES BOCO FORMAT"
  } else {
    orgResponse = "ID DOES NOT MATCH EXISTING FORMATS"
  }
  return orgResponse
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

function sendRandMessage() {
  var date = new Date();
  var currHour = date.getHours()
  var currMin = date.getMinutes()
  var currSecond = date.getSeconds()
  if (currHour === 0 && currMin === 0 && currSecond === 0) {
    sendMsgHour = Math.floor(Math.random() * 24) + 1
    sendMsgMin = Math.floor(Math.random() * 60) + 1
    sendMsgSecond = Math.floor(Math.random() * 60) + 1
  }
  if (currHour === sendMsgHour && currMin === sendMsgMin && currSecond === sendMsgSecond) {
    var randMsgIndex = Math.floor(Math.random() * 19)
    generalChanMsg.channel.send(randomMessages[randMsgIndex])
  }
}

async function getData(auth) {
  sendRandMessage()
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
          orgResponse = getIDType(row[14])
          sendEmbed(row[0] + " " + fname + " " + lname + " has registered for the club!\nTHIS USER INDICATED THAT THEY HAVE REGISTERED BEFORE BUT DATA IS NOT IN DATABASE", `> Email:  ${row[15]}\n> Discord: NOT AVAILABLE\n> School/Org: ${orgResponse}\n> Berklee ID: ${row[14]}`)
        } else {
          if (row[14] == "N/A") {
            retVal = getNonBerkleeStudentInfo(rows, fname, lname, row[15])
            console.log(tempStudent)
            if (retVal == "val") {
              sendEmbed(row[0] + " " + fname + " " + lname + " has registered for the club!",`> Email:  ${row[15]}\n> Discord: ${tempStudent.discord}\n> School/Org: ${tempStudent.org}\n> School ID: ${tempStudent.id}`)
            }
            if (row[15] != tempStudent.email) {
              initmsg.channel.send(`Data mismatch for email, user entered ${row[15]}, database contains ${tempStudent.email}`)
            }
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

function getNonBerkleeStudentInfo(rows, fname, lname, email) {
  database.forEach((key, value) => {
    if (key.fname === fname) {
      if (key.lname === lname) {
        console.log("found", lname)
        tempStudent.fname = key.fname
        tempStudent.lname = key.lname
        tempStudent.email = key.email
        tempStudent.id = key.id
        tempStudent.discord = key.discord
        tempStudent.org = key.org
        console.log(tempStudent.discord)
        console.log(tempStudent.id)
        return "val"
      }
    }
  });
  return "nonee"
};

client.login('key_here');
