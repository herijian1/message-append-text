import plugin from '../../lib/plugins/plugin.js'

export class AppendText extends plugin {
  constructor() {
    super({
      name: '消息追加文本',
      dsc: '在机器人回应消息开头或结尾添加自定义文本',
      event: 'message',
      priority: -1,
      rule: [
        {
          reg: '',
          fnc: 'onMessage',
          log: false
        }
      ]
    })

    this.config = {
      position: 'end',
      // end是添加在消息最末尾，start是消息最开头
      text: '\n>——星光杳杳，晚风慢慢。'
    }
  }

  async onMessage(e) {
    const self = this

    const originalReply = e.reply
    e.reply = async function (msg, quote, data) {
      let processedMsg = self.processMessage(msg, e)
      return originalReply.call(this, processedMsg, quote, data)
    }

    const originalSendMsg = e.sendMsg
    e.sendMsg = async function (msg, quote, data) {
      let processedMsg = self.processMessage(msg, e)
      return originalSendMsg.call(this, processedMsg, quote, data)
    }

    return false
  }

  processMessage(msg, e) {
    let isQQBot = false
    if (e.bot && e.bot.adapter) {
      if (e.bot.adapter.id === 'QQBot') {
        isQQBot = true
      }
    }
    
    if (!isQQBot) {
      return msg
    }

    if (typeof msg === 'string') {
      return this.config.position === 'start'
        ? this.config.text + msg
        : msg + this.config.text
    } else if (Array.isArray(msg)) {
      let processedMsg = [...msg]
      if (this.config.position === 'start') {
        processedMsg.unshift(this.config.text)
      } else {
        processedMsg.push(this.config.text)
      }
      return processedMsg
    }
    return msg
  }
}
