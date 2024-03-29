import * as core from '@actions/core';
import {IncomingWebhookDefaultArguments} from '@slack/webhook';

import {Slack} from './slack';

async function run() {
  try {
    const url: string = process.env.SLACK_WEBHOOK ?? core.getInput('url');
    const slackOptions: IncomingWebhookDefaultArguments = {
      channel: core.getInput('channel'),
      icon_emoji: 'tada'
    };
    const created_tag: string = core.getInput('created_tag');
    const message: string | undefined = core.getInput('message');

    if (url === '') {
      throw new Error(`[Error] Missing Slack Incoming Webhooks URL.
      Please configure "SLACK_WEBHOOK" as environment variable or
      specify the key called "url" in "with" section.
      `);
    }

    const slack = new Slack();
    const payload = await slack.generatePayload(created_tag, message);
    console.info(`Generated payload for slack: ${JSON.stringify(payload)}`);

    await slack.notify(url, slackOptions, payload);
    console.info('Sent message to Slack');
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
