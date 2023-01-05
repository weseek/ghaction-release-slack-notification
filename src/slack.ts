import * as github from '@actions/github';
import {MessageAttachment} from '@slack/types';
import {
  IncomingWebhook,
  IncomingWebhookSendArguments,
  IncomingWebhookResult,
  IncomingWebhookDefaultArguments
} from '@slack/webhook';
import {Context} from '@actions/github/lib/context';

export class Slack {
  readonly context: Context = github.context;

  /**
   * Generate slack payload
   * @returns {IncomingWebhookSendArguments}
   */
  public async generatePayload(
    created_tag: string,
    message?: string,
  ): Promise<IncomingWebhookSendArguments> {
    const {owner, repo} = this.context.repo;
    const repoUrl: string = `https://github.com/${owner}/${repo}/releases/tag/${created_tag}`;

    const text: string = message ?? `*Release ${created_tag}* Succeeded`;

    const block = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${repoUrl}`
      }
    };

    const attachments: MessageAttachment = {
      color: '#2cbe4e',
      blocks: [block]
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
