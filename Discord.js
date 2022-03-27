import fetch from "node-fetch";
import moment from "moment";

class Discord {

  constructor(token) {
    this.token = token
  }

  static login = (email,password) =>
  new Promise((resolve, reject) => {
    fetch("https://discord.com/api/v9/auth/login", {
      method: "POST",
      headers: {
        Host: "discord.com",
        "user-agent": "Discord-Android/117014",
        "x-discord-locale": "en-US",
        "accept-language": "en-US",
        "content-type": "application/json; charset=UTF-8",
        "accept-encoding": "gzip",
      },
      body: JSON.stringify({
        login: email,
        password: password,
        undelete: false,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if(res.token){
          this.token = res.token
          return resolve(res)
        }
        reject(res)
      })
      .catch((err) => reject(err));
  });

  getUserInfo = (userId = "@me") =>
    new Promise((resolve, reject) => {
      fetch(`https://discord.com/api/v9/users/${userId}`, {
        headers: {
          Host: "discord.com",
          "user-agent": "Discord-Android/117014",
          authorization: this.token,
          "x-discord-locale": "en-US",
          "accept-language": "en-US",
          "content-type": "application/json; charset=UTF-8",
          "accept-encoding": "gzip",
        },
      })
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });


    getMessages = (channelId, limit = 50) =>
    new Promise((resolve, reject) => {
      fetch(
        `https://discord.com/api/v9/channels/${channelId}/messages?limit=${limit}`,
        {
          method: "GET",
          headers: {
            Host: "discord.com",
            "user-agent": "Discord-Android/117014",
            authorization: this.token,
            "x-discord-locale": "en-US",
            "accept-language": "en-US",
            "content-type": "application/json; charset=UTF-8",
            "accept-encoding": "gzip",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });

  sendMessage = (channelId, message) =>
    new Promise((resolve, reject) => {
      fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          Host: "discord.com",
          "user-agent": "Discord-Android/117014",
          authorization: this.token,
          "x-discord-locale": "en-US",
          "accept-language": "en-US",
          "content-type": "application/json; charset=UTF-8",
          "accept-encoding": "gzip",
        },
        body: JSON.stringify({
          content: `${message}`,
          sticker_ids: [],
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.errors) {
            console.log(
              `[${moment().format("hh:mm:ss")}] [${
                res.author.username
              }] Send Message : ${res.content}`
            );
          } else {
            console.log(
              `[${moment().format("hh:mm:ss")}] Failed send messages`
            );
          }
          resolve(res);
        })
        .catch((err) => reject(err));
    });


    getMessagesByOwo = async (channelId) => {
      const owo_id = "408785106942164992";
  
      const data = await this.getMessages(channelId, 10);
  
      if (data) {
        const filteredData = data.filter((el) => {
          return el.author.id == owo_id;
        });
  
        return filteredData;
      }
  
      return null;
    };
  
    getOwoMessageFor = async (channelId, username) => {
      const data = await this.getMessagesByOwo(channelId);
  
      if (data !== null) {
        let finalData = [];
  
        for (let datum of data) {
          if (datum.embeds.length !== 0) {
            if (datum.embeds[0].author) {
              if (datum.embeds[0].author.name.match(username) !== null) {
                finalData.push(datum);
              }
            }
          } else {
            if (datum.content.match(username) !== null) {
              finalData.push(datum);
            }
          }
        }
  
        return finalData;
      }
  
      return null;
    };

    getMessageByKeyword = (data, keyword) => {
      for (let datum of data) {
        if (datum.content.match(keyword) !== null) {
          return datum;
        }
      }
      return null;
    };
  
    checkCaptchaVerif = (channelId,username, fn) =>
      new Promise(async (resolve, reject) => {
        const data = await this.getOwoMessageFor(channelId, username);
        if (data !== null) {
          const message = await this.getMessageByKeyword(data, "captcha");
          if (message === null || message === undefined) {
            await fn();
            return resolve();
          }
          
          console.log('[BOT] [ALERT] Verify Captha!');
          reject(message.content);
          return process.exit(0);
        }
      });

}

export default Discord;