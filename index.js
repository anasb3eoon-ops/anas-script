const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is Online!'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
const axios = require('axios');
const crypto = require('crypto');

// Target castles and their IDs
const castles = [
    { name: "Serial Killers", id: "6ada75e0a4ae87f007a98f1e" },
    { name: "Falcons", id: "6a00fa06aebe3bc8778f0f23" }
];

let castleIndex = 0;
let successCount = 0;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate random seconds between min and max
function getRandomSeconds(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Beautiful countdown function with icons
async function countdown(seconds) {
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(`\r⏳ Waiting for next raid: [ ${i} seconds remaining ]...   `);
        await sleep(1000);
    }
    console.log("\r⏳ Wait time finished, sending stealth raid request now...                    ");
}

async function sendRaid() {
    const currentCastle = castles[castleIndex];
    console.log(`\n----------------------------------------`);
    console.log(`🎯 [New Cycle] Targeting Castle: ${currentCastle.name}`);

    try {
        // Unique idempotency key to prevent duplication
        const idempotencyKey = crypto.randomUUID();

        // Sending direct API request with cookies and CSRF token
        const response = await axios.post(
            'https://vloria-vk.duckdns.org/api/clanfall/actions',
            {
                action: "stealth",
                targetClanId: currentCastle.id,
                idempotencyKey: idempotencyKey
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'powerar_session=2q4Lf5VCh10ktycb.e4Ndatj3eJW1gIKbPHF3cg.KD7lAZe5rG-PxDhY42HawQg4Edgzin_3WeJLdGrS-u_V1tkmcXFymnnfJ7F04AmBvvPuzlcWZHR6ksrc_jFvnpWdU4hvgIAL3hj-3jRZXh2_fQ8coWKSM4YNKMtXzxlnRBurO3jWhUfw6o2p5aS3WXpzeHafWYPl82f_bzD43mYZsZu1hb-bZbLbNAmNWWVJe5_UAt2sIDvj9FzreFLp_vsiM2dal_A-cj0UHsOANnmHU4ZCtcC7b3xHNKHxZ-PaQF7tBMXdMrhRIniVPRrTyGu-RLuvzT7c3eYhHqjXN_b1zQWzwhC1QeHT5JG_w397NMqYImxeiDm2dfF7Kro2uGKzfsQW1b8G7gsEv-EBfelPXxlyTzsldWgwy_ISrCUf_GHpsrLu8yEe9GsOfp8WhaigivTgcFvXhA-gUZ5jMTFT499zWhr2FszWVSDDV6BgrnUbKk1pAcerJYaKmEyU',
                    'x-csrf-token': '5brtb7pdKhQlQuSAbdMDpHPQTPf4JGmV',
                    'Origin': 'https://vloria-vk.duckdns.org',
                    'Referer': 'https://vloria-vk.duckdns.org/clanfall',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="8", "Google Chrome";v="122"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin'
                }
            }
        );

        if (response.status === 200 || response.status === 201) {
            successCount++;
            console.log(`✅ Stealth raid completed successfully! 📊 Total successful raids: [ ${successCount} ]`);
        } else {
            console.log(`⚠️ Unexpected response status: ${response.status}`);
        }

    } catch (error) {
        if (error.response) {
            console.error(`❌ Server rejected request (Status ${error.response.status}):`, error.response.data);
        } else {
            console.error("❌ Connection error:", error.message);
        }
    }

    // Switch to the next castle for the next cycle
    castleIndex = (castleIndex + 1) % castles.length;

    // Generate random wait time between 300 seconds (5 mins) and 360 seconds (6 mins)
    const randomWaitTime = getRandomSeconds(300, 360);
    const mins = Math.floor(randomWaitTime / 60);
    const secs = randomWaitTime % 60;

    console.log(`⏳ Next raid on castle (${castles[castleIndex].name}) will be sent after ${mins} minute(s) and ${secs} second(s) (${randomWaitTime}s):`);
    
    await countdown(randomWaitTime);
    
    sendRaid();
}

console.log("========================================");
console.log("🚀 Starting Clanfall API Bot (Random 5-6m)...");
console.log("========================================");
sendRaid();