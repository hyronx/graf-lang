//@flow

import Rete from "rete"
import uuid from "uuid/v4"

export class Message {
  /**
   * @enum
   * @type {{TABLE: (NodeResult.Presentation|number), NUMBER: (NodeResult.Presentation|number), TEXT: (NodeResult.Presentation|number), LIST: (NodeResult.Presentation|number)}}
   */
  static Presentation = {
    TABLE: "TABLE",
    LIST: "LIST",
    NUMBER: "NUMBER",
    TEXT: "TEXT",
  }

  /**
   * Creates a new NodeResult object
   * @param {string} messageType - The type of this message
   * @param {Rete.Node} origin - The node which has produced this message
   * @param {*} data - The message data
   * @param {*} type - The data type
   * @param {Date} sendTime - The time when this message has been sent
   * @param {string|null} presentation - Defines the presentation
   */
  constructor(
    messageType: string,
    origin: Rete.Node,
    data: any,
    dataType: any,
    sendTime: Date,
    presentation: ?string = null,
    id: string = uuid()
  ) {
    this.id = id
    this.origin = origin
    this.data = data
    this.startTime = sendTime
    this.presentation =
      presentation || Message.getDefaultPresentation(this.data)
  }

  toString() {
    const dataType = this.dataType ? ` <${this.dataType}>` : ""
    return `(Message <${this.messageType}> ` +
      `{ id: ${this.id}, ` +
      `data${dataType}: ${this.data}, ` +
      `sendTime: ${this.sendTime}, ` +
      `presentation: ${this.presentation} ` +
      `})`
  }

  toJSON() {
    return {
      id: this.id,
      messageType: this.messageType,
      origin: this.origin,
      data: this.data,
      dataType: this.dataType,
      sendTime: this.sendTime,
      presentation: this.presentation,
    }
  }

  /**
   * Returns the default presentation option based on the data
   * @param {*} data
   * @return {Presentation}
   */
  static getDefaultPresentation(data) {
    if (Array.isArray(data)) {
      if (data.every(e => Array.isArray(e))) {
        return this.Presentation.TABLE
      } else {
        return this.Presentation.LIST
      }
    }

    if (Number(data) === data) {
      return this.Presentation.NUMBER
    }

    if (String(data) === data) {
      return this.Presentation.TEXT
    }
  }
}

export default Message
