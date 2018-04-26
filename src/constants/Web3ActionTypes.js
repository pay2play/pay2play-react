const ActionTypes = {
  RETRIEVE_WAGERS: 'RETRIEVE_WAGERS',
  RETRIEVE_WAGERS_RESPONSE: 'RETRIEVE_WAGERS_RESPONSE',
  RETRIEVE_WAGER_RESPONSE: 'RETRIEVE_WAGER_RESPONSE',
  RETRIEVE_ACCOUNTS: 'RETRIEVE_ACCOUNTS',
  RETRIEVE_ACCOUNTS_RESPONSE: 'RETRIEVE_ACCOUNTS_RESPONSE',

  START_WAGER: 'START_WAGER',
  START_WAGER_RESPONSE: 'START_WAGER_RESPONSE',

  COUNTER_WAGER_AND_DEPOSIT: 'COUNTER_WAGER_AND_DEPOSIT',
  COUNTER_WAGER_AND_DEPOSIT_RESPONSE: 'COUNTER_WAGER_AND_DEPOSIT_RESPONSE',

  SET_WAGER_WINNER: 'SET_WAGER_WINNER',
  SET_WAGER_WINNER_RESPONSE: 'SET_WAGER_WINNER_RESPONSE',

  WITHDRAW_WINNINGS: 'WITHDRAW_WINNINGS',
  WITHDRAW_WINNINGS_RESPONSE: 'WITHDRAW_WINNINGS_RESPONSE',

  SET_SECRET: 'SET_SECRET',
  SET_SECRET_RESPONSE: 'SET_SECRET_RESPONSE',

  GET_SECRET_HASH: 'GET_SECRET_HASH',
  GET_SECRET_HASH_RESPONSE: 'GET_SECRET_HASH_RESPONSE',

  // BRACKET
  GET_SEATS_SIDE_A: 'GET_SEATS_SIDE_A',
  GET_SEATS_SIDE_B: 'GET_SEATS_SIDE_B',

  GET_SEATS_SIDE_A_RESPONSE: 'GET_SEATS_SIDE_A_RESPONSE',
  GET_SEATS_SIDE_B_RESPONSE: 'GET_SEATS_SIDE_B_RESPONSE',

  TAKE_SEAT_SIDE_A: 'TAKE_SEAT_SIDE_A',
  TAKE_SEAT_SIDE_B: 'TAKE_SEAT_SIDE_B',

  TAKE_SEAT_SIDE_A_RESPONSE: 'TAKE_SEAT_SIDE_A_RESPONSE',
  TAKE_SEAT_SIDE_B_RESPONSE: 'TAKE_SEAT_SIDE_B_RESPONSE',

  PROMOTE_PLAYER_SIDE_A: 'PROMOTE_PLAYER_SIDE_A',
  PROMOTE_PLAYER_SIDE_B: 'PROMOTE_PLAYER_SIDE_B',

  PROMOTE_PLAYER_SIDE_A_RESPONSE: 'PROMOTE_PLAYER_SIDE_A_RESPONSE',
  PROMOTE_PLAYER_SIDE_B_RESPONSE: 'PROMOTE_PLAYER_SIDE_B_RESPONSE',

  PING: 'PING'
};

export default ActionTypes;
