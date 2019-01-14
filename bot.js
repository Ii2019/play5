const Discord = require('discord.js');  
const db = require('quick.db');  
const hastebin = require('hastebin-gen');  
const client = new Discord.Client();    
const Canvas = require('canvas');        
const fs = require("fs"); 
const getYoutubeID = require('get-youtube-id'); 
const moment = require("moment");   
const { Client, Util } = require('discord.js');  
const UserBlocked = new Set();  
const jimp = require('jimp');   
const math = require('math-expression-evaluator'); 
const stripIndents = require('common-tags').stripIndents;
const figlet = require('figlet'); 
const queue = new Map(); 
const zalgo = require('zalgolize');   
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const sql = require("sqlite");
 const dateFormat = require('dateformat'); 
 const pretty = require('pretty-ms') 
const prefix = "3";

client.on("ready", () => {
  console.log("Yossif | Logged in! Server count: ${client.guilds.size}");
  client.user.setGame(`Music Ultra`, 'https://www.twitch.tv/hix');
});



const adminprefix = "3";
const developers = ['516364281990611006'];

console.log("YossiF ");

client.on('ready', () => {
    console.log(`Logged as ${client.user.tag}By : Yossif`)
})

client.on('message', message => {
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!developers.includes(message.author.id)) return;
  if (message.content.startsWith(adminprefix + 'ply')) {
    client.user.setGame(argresult);
      message.channel.send(`تم تغيير البلاينق الى   ${argresult}`)
  } else 
     if (message.content === (adminprefix + "leave")) {
    message.guild.leave();        
  } else  
  if (message.content.startsWith(adminprefix + 'wt')) {
  client.user.setActivity(argresult, {type:'WATCHING'});
      message.channel.send(`تَم تغيير الواتشينق الى   ${argresult}`)
  } else 
  if (message.content.startsWith(adminprefix + 'ls')) {
  client.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.send(`تَم تغيير الليسينينق الى   ${argresult}`)
  } else
  if (message.content.startsWith(adminprefix + 'st')) {
    client.user.setGame(argresult, "https://www.twitch.tv/Randy");
      message.channel.send(`تم تغييرك حالتك بالتويتش الى   ${argresult}`)
  }
  if (message.content.startsWith(adminprefix + 'sn')) {
  client.user.setUsername(argresult).then
      message.channel.send(`جاري تغيير الأسم لـ ..${argresult} `)
} else
if (message.content.startsWith(adminprefix + 'sa')) {
  client.user.setAvatar(argresult);
    message.channel.send(`جاري تغيير الأفتار... : `);
}
});



client.on('message', async msg => {
    if (msg.author.bot) return undefined;
   
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
   
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
 
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
 
    if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('** أنت غير متصل في الروم** :x:');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
           
            return msg.channel.send('**ليس لدي إذن للاتصال في هذه الروم الصوتية** :x:');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('**ليس لدي إذن ان اتكلم في الروم الصوت هذه** :x:');
        }
 
        if (!permissions.has('EMBED_LINKS')) {
            return msg.channel.sendMessage("**أنا لا أميل إذن `EMBED_LINKS` :x:**")
        }
 
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
           
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return msg.channel.send(` **${playlist.title}** Added To Queue`);
        } else {
            try {
 
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                    const embed1 = new Discord.RichEmbed()
                                .setThumbnail('https://e.top4top.net/p_1001lsv3w1.png')
                    .setDescription(`**Please Type The Song Number** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
 
                    .setFooter("Music BoT")
                    msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
                   
                    // eslint-disable-next-line max-depth
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 15000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.error(err);
                        return msg.channel.send('No Number Song Typed :x:');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('I Cant Find This Song :x:');
                }
            }
 
            return handleVideo(video, msg, voiceChannel);
        }
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send('انت مش متصل في الروم :x:');
        if (!serverQueue) return msg.channel.send('لم يتم تشغيل أي أغنية :x:');
        serverQueue.connection.dispatcher.end('تم تم تخطي الأغنية');
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست في روم الصوت :x:');
        if (!serverQueue) return msg.channel.send('لم يتم تشغيل أي أغنية :x:');
        if (!args[1]) return msg.channel.send(`:loud_sound: The Song Volume: **${serverQueue.volume}**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`:speaker: The Voice Volume Changed To **${args[1]}**`);
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send('لم يتم تشغيل أي أغنية :x:');
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: Now Playing : **${serverQueue.songs[0].title}**`)
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `queue`) {
       
        if (!serverQueue) return msg.channel.send('لم يتم تشغيل أي أغنية :X:');
        let index = 0;
       
        const embedqu = new Discord.RichEmbed()
 
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Now Starting :** ${serverQueue.songs[0].title}`)
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `stop`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('الأغنية قد توقفت');
        }
        return msg.channel.send('لم يتم تشغيل أي أغنية :X:');
    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('الموسيقى المستأنفة');
        }
        return msg.channel.send('تم تشغيل الاغنية :X:');
    }
 
    return undefined;
});
 
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
   

    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);
 
        queueConstruct.songs.push(song);
 
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`لم أتمكن من الانضمام إلى روم الصوتية: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(` لا أستطيع الاتصال بهذه روم الصوتية : ${error} :X:`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(` **${song.title}** واحد وقد تم إضافة الأغنية إلى قائمة الانتظار`);
    }
    return undefined;
}
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
 
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('انتهت الأغنية.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
 
    serverQueue.textChannel.send(`Starting The Song : **${song.title}**`);
}
 
       client.on('message', message =>{
  if(message.content.startsWith(`${prefix}leave`)){
    const voiceChannel = message.member.voiceChannel
    voiceChannel.leave();
    message.channel.send(":mailbox_closed: انقطع الاتصال")
}})
 
 client.on('message', message =>{
  if(message.content === `${prefix}ping`){
let start = Date.now(); message.channel.send('pong').then(message => { 
message.edit(`\`\`\`js
Time taken: ${Date.now() - start} ms
Discord API: ${client.ping.toFixed(0)} ms\`\`\``);
  });
  }
});


 
client.on('message', msg => {

    if (msg.content == '3join') {
        if (msg.member.voiceChannel) {

     if (msg.member.voiceChannel.joinable) {
         msg.member.voiceChannel.join().then(msg.react('white_check_mark'));
     }
    }
}
});

client.on("message", (message) => {
    if (message.content.startsWith('-delet')) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply(":thinking: **انت لا تملك صلاحيات** ");

        let args = message.content.split(' ').slice(1);
        let channel = message.client.channels.find('name', args.join(' '));
        if (!channel) return message.reply('**There is no room like this name -_-**').catch(console.error);
        channel.delete()
    }
});  



	client.on('message', message => {
    if (message.author.bot) return;
     if (message.content === prefix + "help") {
     message.channel.send('**تم ارسال رسالة في الخاص**');




 message.author.sendMessage(`
** BOT  ${client.user.username} Commands **
● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●
** #    [ ${prefix}play ]  [ لتشغيل أغنية من يوتيوب ]

#    [ ${prefix}skip ] [ لتجاوز الأغنية و تشغيل الأغنية التالية  ]

#    [ ${prefix}stop ] [ لتوقيف لاغنية ]

#    [ ${prefix}resume ] [ استئناف الأغنية ]

#    [ ${prefix}vol ] [ لتغيير حجم الصوت ]

#    [ ${prefix}leave ] [ لفصل بوت من Voicechannel الخاص بك ]

#    [ ${prefix}queue ] [ عرض قائمة انتظار الأغاني ]

#    [ ${prefix}join ] [ نضم الى اروم ]**

● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

`);

    }
});



	client.on('message', message => {
    if (message.author.bot) return;
     if (message.content === prefix + "-help") {
     message.channel.send('**تم ارسال رسالة في الخاص**');




 message.author.sendMessage(`
** BOT  ${client.user.username} Commands **
● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●
** #    [ ${prefix}sa ]  [ لتغير صورة البوت  ]

#    [ ${prefix}sn ] [ لتغير اسم البوت  ]

#    [ ${prefix}st ] [لتغير حالت البوت التويتش ]

#    [ ${prefix}ls ] [لتغير حالت البوت الليسينينق ]

#    [ ${prefix}wt ] [ لتغير حالت البوت الواتشينق ]

#    [ ${prefix}ply ] [ لتغير  حالت البوت البلاينق ]**

● ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ●

`);

    }
});

client.login(process.env.BOT_TOKEN);
