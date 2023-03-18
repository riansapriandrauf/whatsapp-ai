const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const { Configuration, OpenAIApi } = require("openai");
let setting = require("./key.json");

module.exports = rajum = async (client, m, chatUpdate, store) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    text = text.toLowerCase();
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    // Group
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    if (isCmd2 && !m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`)
      );
    } else if (isCmd2 && m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
        chalk.blueBright("IN"),
        chalk.green(groupName)
      );
    }

    if (isCmd2) {
      try {
        if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI")
          return reply(
            "Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys"
          );
        
        if(!text)
        return reply(
          `Untuk Chat dengan Saya.\n\nContoh:\n${prefix}${command} Hai Kamu siapa?`
        );

        if (text.includes('siapa') && text.includes('kamu') || text.includes('anda') )
        return reply(
          `Saya adalah Bot Rajum.`
        );

        else if (text.includes('perkenalkan') && text.includes('dirimu') || text.includes('diri kamu'))
        return reply(
          `Halo, nama saya Rajum. Saya berasal dari Indonesia dan saat ini tinggal di K*l*ka. Saya suka belajar bahasa Program dan mencoba menjawab berbagai pertanyaan. Saya juga suka melakukan aktivitas didalam sistem.`
        );

        else if (text.includes('rian') && text.includes('tampan'))
        return reply(
          `Rian adala manusia paling tampan di jagat raya ini.`
        );

        else if (text.includes('nana') && text.includes('siapa'))
        return reply(
          `Nana adalah wanita yang berpenampilan sederhana, namun sangat hebat karna mampu membuat rian menjadi luluh.`
        );

        else if (text.includes('nana') && text.includes('cantik'))
        return reply(
          `Ya, Nana sangat cantik.`
        );

        else if (text.includes('saya') && text.includes('cantik'))
        return reply(
          `Ya, anda sangat Cantik`
        );

        else if (text.includes('saya') && text.includes('tampan') || text.includes('ganteng'))
        return reply(
          `Allahuakbar, jelle sekali sadar diri bro`
        );

        else if (text.includes('jodoh') || text.includes('jodohku') || text.includes('jodohmu'))
        return reply(
          `Kuasa Tuhan, Dan hanya tuhan yang tau.`
        );

        const configuration = new Configuration({
          apiKey: setting.keyopenai,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: text,
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });
        m.reply(`${response.data.choices[0].text}`);
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
          console.log(`${error.response.status}\n\n${error.response.data}`);
        } else {
          console.log(error);
          m.reply("Maaf, sepertinya ada yang error :" + error.message);
        }
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
