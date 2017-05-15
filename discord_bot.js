function require_discord() {
	try {
		console.log("requiring discord.js ..")
	    return require("discord.js");
	}
	catch (e) {
	    console.log(e.stack);
	    console.log(process.version);
	    console.log("error requiring discord.js");
	    process.exit();
	}
}

function get_bot_auth() {
	// Get authentication data
	try {
		console.log("requiring auth.json ..")
	    return require("./auth.json");
	}
	catch (e) {
	    console.log("auth.json missing, please create the file based on auth.json.example");
	    process.exit();
	}
}

var fs = require('fs');
var discord = require_discord();
var bot = new discord.Client();
var auth = get_bot_auth();

console.log("booting up the DiscordStats bot version: " + process.version + "\n with discord.js version: " + Discord.version);

// use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
var log = fs.createWriteStream('log.txt', {'flags': 'w'});
log.write('start of log - ' + new Date().toString() + "\n");

// test commands
var commands = {
    "test": {
        process: function(bot, msg, suffix) {
            msg.channel.sendMessage(suffix);
        }
    }
};

// ready event
bot.on("ready", function() {
	console.log("bot ready")
});

// dc event
bot.on("disconnected", function() {
    console.log("bot disconnected");
	log.end('end of log\n');
    process.exit(1);

});

// log messages to file
function logMessage(msg, edited) {
	console.log("Author: " + msg.author + "| isEdit: " + isEdit + " | Content: " + msg.content);

	var date = new Date().toString();
	var author =  " <" + msg.author + "> ";
	var edited = "";
	if (edited === true) edited = " (*) ";

	log.write(date + author + edited + msg.content + "\n");
}

// chat message
bot.on("message", (msg) => {
	logMessage(msg, false);
});

// edited chat message
bot.on("messageUpdate", (oldMessage, newMessage) => {
    logMessage(newMessage, true);
});

// user status change
bot.on("presence", function(user, status, gameId) {
	console.log(user, status, gameId);

});

// login
if (auth.token) {
    console.log("logging in with token");
    bot.login(auth.token);
}
