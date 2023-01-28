require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);
module.exports = openai;

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const { getChat, getImage } = require("./helper/openAi");
const logger = require("./helper/logger");
const client = new Client({ authStrategy: new LocalAuth() });

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Cuenta vinculada!");
  listenMessage(); 
});

client.on("message", async (message) => {
  if (message.body.startsWith("/ask") || message.body.startsWith("/image")) {
    if (message.body.startsWith("/ask")) {
      const text = message.body?.replace("/ask", "")?.trim().toLowerCase();
      logger.info(`Chat: ${message.notifyName}:  ${text}`);
     
      if (text) {
        const res = await getChat(text);
        if (res) {
          message.reply(res.trim());
        }
      }
    } else if (
      message.body.startsWith("/image") ) {
      const text = message.body?.replace("/image", "")?.trim().toLowerCase();

      console.log(text);
      if (text) {
        const imageUrl = await getImage(text);
        const med = await MessageMedia.fromUrl(imageUrl);
        if (med) {
          message.reply(med);
        }
      }
    }
  }
});

client.initialize();

const listenMessage = ( ) => {
  client.on ('message',(msg) => {
    //const phone = msg.from.split('@')[0];
    //console.log(from, body, phone);
    const{from, to, body} = msg;
    switch(body){
      case 'hola':
        sendMenssage(from, 'hola como estas'); 
      break

      case 'adios':
        sendMenssage(from, 'nos vemos luego');
        sendMdia(from, 'gato1.jpeg' );
      break

      case 'botones':
        console.log('encuentra los botones')
         let button = new Buttons("Button body",[{id:"customId",body:"button1"},{body:"button2"},{body:"button3"}],"title","footer");
        //'Presciona un Boton',[{id:"customId",body:"button1"},{body:"button2"},{body:"button3"}],"title","footer")
        // console.log("valor de los botones:",button);
        client.sendMessage(from,button)
        break
    }

    console.log(from, body);
    sendMenssage(from, 'mensaje por defecto');
  })
}

const sendMenssage = (to, message) => {
  client.sendMessage(to, message);
}

const sendMdia = (to, file ) => {
  const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
  client.sendMessage(to, mediaFile);
}
