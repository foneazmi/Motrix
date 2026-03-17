import { EventEmitter } from 'node:events'

export default class CommandManager extends EventEmitter {
  constructor () {
    super()

    this.commands = {}
  }

  register (id, fn) {
    if (this.commands[id]) {
      // Command already registered - skip
      return null
    }
    if (!id || !fn) {
      // Invalid command registration - skip
      return null
    }
    this.commands[id] = fn

    this.emit('commandRegistered', id)
  }

  unregister (id) {
    if (this.commands[id]) {
      delete this.commands[id]

      this.emit('commandUnregistered', id)
    }
  }

  execute (id, ...args) {
    const fn = this.commands[id]
    if (fn) {
      try {
        this.emit('beforeExecuteCommand', id)
      } catch (err) {
        // Ignore command execution errors
      }
      const result = fn(...args)
      return result
    } else {
      return false
    }
  }
}
