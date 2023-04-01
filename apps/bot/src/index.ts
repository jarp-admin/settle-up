import * as dotenv from 'dotenv' 
dotenv.config()

import {Client, Events, GatewayIntentBits} from "discord.js"


const client = new Client({intents:[GatewayIntentBits.Guilds]});

client.once(Events.ClientReady, e=>{
    console.log(`Ready! logged in as ${e.user.tag}`)
})

const TOKEN = process.env.TOKEN

console.log(TOKEN)
client.login(TOKEN)