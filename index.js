import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import inquirer from 'inquirer';
import fs from 'fs';
import { loggerFailed, loggerSuccess, loggerInfo } from './logger.js'
import path from 'path';


const getNitro = async (current, total) => {
  let attempts = 2;
  while (attempts > 0) {
    try {
      let token;
      const url = 'https://api.discord.gx.games/v1/direct-fulfillment';
      const headers = {
        'authority': 'api.discord.gx.games',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://www.opera.com',
        'referer': 'https://www.opera.com/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Opera GX";v="106"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };
      const data = {
        partnerUserId: uuidv4(),
      };
      const response = await axios.post(url, data, { headers });

      if (response.data.token) {
        token = response.data.token;
        const link = `https://discord.com/billing/partner-promotions/1180231712274387115/${token}\n`;
        loggerSuccess(`Success get promo code [ ${current} / ${total} ]`)
        const filePath = path.join(process.cwd(), 'result.txt')
        if (!fs.existsSync(filePath)) {
          loggerFailed(`${filePath} not found`)
          loggerInfo('creating file ' + filePath)
          fs.open(filePath, 'w', (err, file) => {
            if (err) {
              loggerFailed('failed to create file at ' + filePath)
            }
            loggerSuccess(`success create file ${filePath}`)
          })
        }
        fs.appendFileSync('result.txt', link);
        return link;
      } else {
        loggerFailed(`failed get promo code ${current}`)
      }
    } catch (error) {
      loggerFailed(error.message)
      loggerInfo('u cant force close this code, if you boring waiting delay')
    }
    attempts--;
  }
  console.log('All attempts failed');
  return null;
};
const delay = async (ms) => {
  loggerInfo(`Waiting delay ${ms}ms`)
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
(async () => {
  try {
    process.stdout.write('\x1Bc');
    console.log('opera-gx x discord\nMade with ❤️ by janexmgd www.facebook.com/janexmgd\n');
    const { howMany } = await inquirer.prompt({
      name: 'howMany',
      type: 'input',
      message: 'how many do you want to generate discord nitro code ? ',
      validate: (input) => {
        const numberInput = Number(input);
        const isValid = Number.isInteger(numberInput) && numberInput > 0;
        return isValid || 'Please enter a positive integer.';
      },
    });
    process.stdout.write('\x1Bc');
    let count = howMany;
    let current = 1;
    while (count > 0) {
      const link = await getNitro(current, howMany);
      if (!link) {
        loggerFailed('task stopped because cant get token')
        break
      }
      await delay(600)
      count--;
      current++;
    }
    loggerSuccess('Task stopped')
  } catch (error) {
    console.log(error);
  }
})();
