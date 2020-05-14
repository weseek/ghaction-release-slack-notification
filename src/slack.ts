import {MessageAttachment} from '@slack/types';
import {
  IncomingWebhook,
  IncomingWebhookSendArguments,
  IncomingWebhookResult,
  IncomingWebhookDefaultArguments
} from '@slack/webhook';

export class Slack {
  /**
   * Generate slack payload
   * @param {string} mention
   * @param {string} mentionCondition
   * @returns {IncomingWebhookSendArguments}
   */
  public async generatePayload(
    created_tag: string
  ): Promise<IncomingWebhookSendArguments> {
    const text: string = `'*Release v${created_tag}*' Succeeded`;

    let baseBlock = {
      type: 'section'
    };

    baseBlock['text'] = {
      type: 'mrkdwn',
      text: `https://github.com/weseek/growi/releases/tag/v${created_tag}`
    };

    const attachments: MessageAttachment = {
      color: '#2cbe4e',
      blocks: [baseBlock]
    };

    const payload: IncomingWebhookSendArguments = {
      text,
      attachments: [attachments],
      unfurl_links: true
    };

    return payload;
  }

  /**
   * Notify information about github actions to Slack
   * @param {IncomingWebhookSendArguments} payload
   * @returns {Promise<IncomingWebhookResult>} result
   */
  public async notify(
    url: string,
    options: IncomingWebhookDefaultArguments,
    payload: IncomingWebhookSendArguments
  ): Promise<void> {
    const client: IncomingWebhook = new IncomingWebhook(url, options);
    const response: IncomingWebhookResult = await client.send(payload);

    if (response.text !== 'ok') {
      throw new Error(`
      Failed to send notification to Slack
      Response: ${response.text}
      `);
    }
  }
}
