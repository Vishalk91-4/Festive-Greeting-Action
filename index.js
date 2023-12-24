const core = require('@actions/core');
const github = require('@actions/github');
const httpm = require('@actions/http-client');

async function makePostRequest() {
    const prompt = core.getInput('prompt');
    const apikey = core.getInput('api-key');
    const endpoint = core.getInput('endpoint');

    let http = new httpm.HttpClient('http-client');
    let data = {
        messages: [
            { role: 'system', content: 'You generate short Festival greeting. The message should be 160 characters or less to fit into an SMS. The user will tell you who the message is for and will provide more context if needed. You will only answer with the text for the sms, nothing else.' },
            { role: 'user', content: 'Mother, haven\'t seen her for a long time, Birthday' },
            { role: 'assistant', content: 'Merry Birthday Mum! I miss you! 🎂 ' },
            { role: 'user', content: 'Laura, is a colleague of mine, Christmas' },
            { role: 'assistant', content: 'Have a great Holiday Season Laura! Thanks for the great partnership this year. 🎁✨' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 0.95,
        stop: null
    };
    let headers = {
        'Content-Type': 'application/json',
        'api-key': apikey
    };

    let res = await http.postJson(endpoint, data, headers);
    return res.result;
}

try {
    makePostRequest().then(response => {
        let message = response.choices[0].message.content;
        console.log(message);
        core.setOutput("seasons-greeting", message);
    }).catch(error => {
        core.setFailed(error.message);
    });
} catch (error) {
    core.setFailed(error.message);
}