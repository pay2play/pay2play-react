var DiscordBotServerActions = require('../actions/DiscordBotServerActions');

import axios from 'axios';

// let DISCORD_BOT_HOST = 'http://127.0.0.1:3000';
let DISCORD_BOT_HOST = 'https://pay2play-discord-bot.cluster.playentertainment.online';

module.exports = {
  ping: function() {
    setTimeout(function() {
      alert("Hello!");

      DiscordBotServerActions.ping('TEST');
    }, 3000);
  },
  retrievePlayers: function(gameId) {
    console.log("retrievePlayers");

    // DISCORD BOT API
    axios.get(`${DISCORD_BOT_HOST}/api/player_list`, {
      params: {
        game: gameId
      }
    })
    .then(function (response) {
      // console.log(response);
      let data = response.data.data;

      DiscordBotServerActions.retrievePlayers(data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    // DISCORD BOT API
  },
  notify: function(type, index, address) {
    console.log("notify");

    // DISCORD BOT API
    axios.get(`${DISCORD_BOT_HOST}/api/notify`, {
      params: {
        type: type,
        wager_id: index,
        ethereum_address: address
      }
    })
    .then(function (response) {
      console.log(response);
      DiscordBotServerActions.notify(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    // DISCORD BOT API
  },
};
