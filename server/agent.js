module.exports = agent => {
  agent.messenger.once('egg-ready', () => {
    agent.messenger.sendToApp('refresh_timestamp', Date.now())
  })

  agent.messenger.on('refresh', () => {
    agent.messenger.sendToApp('refresh_timestamp', Date.now())
  })
}
