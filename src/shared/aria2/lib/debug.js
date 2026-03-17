'use strict'

import { inspect } from 'util'

// Debug module for aria2 - logs all RPC traffic
// Only enable in development environments

module.exports = (aria2) => {
  aria2.on('open', () => {
    // Debug: Connection opened
  })

  aria2.on('close', () => {
    // Debug: Connection closed
  })

  aria2.on('input', (m) => {
    // Debug: Incoming message
  })

  aria2.on('output', (m) => {
    // Debug: Outgoing message
  })
}
