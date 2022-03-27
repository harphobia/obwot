import Discord from './Discord.js';
import readline  from 'readline-sync';

const delayTime = 8

const delay = (second) =>
    new Promise((resolve, _) => {
      setTimeout(() => {
        resolve();
      }, second * 1000);
    });

(async()=>{

    try {
        let auth = null;
        if(readline.keyInYN("[?] Apakah Anda memiliki TOKEN?")){
            auth = readline.question("[?] TOKEN : ")
        }else{
            const email = readline.question("[?] EMAIL : ")
            const password = readline.question("[?] PASSWORD : ")

            const {token} =await Discord.login(email,password)
            if(token){
                console.log(`[!] TOKEN : ${token}\n[!] Gunakan TOKEN tersebut untuk login lain kali`);
                auth = token
            }
        }

        if(auth !== null){
            console.log('[BOT] Try to login...');

            const app = new Discord(auth)
            const {id,username} = await app.getUserInfo()

            if(id,username){
                console.log(`[BOT] Success login as ${username}...`);

                const channelSpam = readline.question("[?] Masukan ID Channel untuk spam : ")

                const {code} = await app.getMessages(channelSpam,1);
                if(!code){

                    console.log('[BOT] [Success] Start running...');

                    setInterval(async () => {
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                          await app.sendMessage(channelSpam, "owo");
                        });
                  
                        await delay(delayTime);
                  
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                           await app.sendMessage(channelSpam, "owo hunt");
                         });
                  
                        await delay(delayTime);
                  
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                          await app.sendMessage(channelSpam, "owo battle");
                        });
                      }, 40 * 1000);
        
                    setInterval(async () => {
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                            await app.sendMessage(channelSpam, "owo");
                        });
                  
                        await delay(delayTime);
                  
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                            await app.sendMessage(channelSpam, "owo pray");
                        });
                  
                        await delay(delayTime);
                  
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                            await app.sendMessage(channelSpam, "owo slot 1");
                        });
                  
                        await delay(delayTime);
                  
                        await app.checkCaptchaVerif(channelSpam, username, async () => {
                            await app.sendMessage(channelSpam, "owo coinflip 1");
                        });
                      }, 5 * 60 * 1000 + 10 * 1000);
                }else{
                    console.log("[BOT] INVALID CHANNEL ID");
                }

            }else{
                console.log("[BOT] INVALID TOKEN");
            }

        }

    } catch (error) {
        console.log(error);
    }

})()