module.exports = {
  broadcast(instance, message) {
    instance
      .getWss()
      .clients.forEach(client => client.send(JSON.stringify(message)));
  }
};
