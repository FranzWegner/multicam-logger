'use strict'
const EventEmitter = require('events')
const lineReader = new EventEmitter()
const xevEmitter = new EventEmitter()

function init (readable) {
    let lineText = ""

    readable.on('readable', () => {
      const chunk = readable.read()
      if (chunk == null) {
        return
      }
      const chunkSplit = chunk.toString().split("\n")
      for (let i = 0; i < chunkSplit.length; i++) {
        lineText += chunkSplit[i]
        lineReader.emit('line', lineText)
        lineText = ""
      }
      lineText += chunkSplit[chunkSplit.length - 1]
    })

    let eventText = ""
    let eventName = null

    lineReader.on('line', (text) => {
        if (text === "") {
            eventText = ""
            eventName = null
            return
        }

        if (eventText === "") {
            eventName = text.slice(0, text.indexOf(' ')).trim()
        }

        const match = /\(keysym 0x[^,]*, (.*)\)/.exec(text)
        if (match) {
            xevEmitter.emit(eventName, match[1])
        }

        eventText += text
        return
    })

    return xevEmitter
}

module.exports = init
