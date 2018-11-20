#include "gameplay.cpp"

void cardgame::login(name username) {
  // Ensure this action is authorized by the player
  require_auth(username);
  
  // Create a record in the table if the player doesn't exist in our app yet
  auto user_iterator = _users.find(username.value);
  if (user_iterator == _users.end()) {
    user_iterator = _users.emplace(username,  [&](auto& new_user) {
      new_user.username = username;
    });
  } 
}

void cardgame::startgame(name username) {
  // Ensure this action is authorized by the player
  require_auth(username);

  auto& user = _users.get(username.value, "User doesn't exist");
  
  _users.modify(user, username, [&](auto& modified_user) {
    // Create a new game
    game game_data;

    // Draw 4 cards each for the player and the AI
    for (uint8_t i = 0; i < 4; i++) {
      draw_one_card(game_data.deck_player, game_data.hand_player);
      draw_one_card(game_data.deck_ai, game_data.hand_ai);
    }

    // Assign the newly created game to the player
    modified_user.game_data = game_data;
  });
}

void cardgame::playcard(name username, uint8_t player_card_idx) {
  // Ensure this action is authorized by the player
  require_auth(username);

  // Checks that selected card is valid
  eosio_assert(player_card_idx < 4, "playcard: Invalid hand index");

  auto& user = _users.get(username.value, "User doesn't exist");

  // Verify game status is suitable for the player to play a card
  eosio_assert(user.game_data.status == ONGOING,
               "playcard: This game has ended. Please start a new one");
  eosio_assert(user.game_data.selected_card_player == 0,
               "playcard: The player has played his card this turn!");

  _users.modify(user, username, [&](auto& modified_user) {
    game& game_data = modified_user.game_data;

    // Assign the selected card from the player's hand
    game_data.selected_card_player = game_data.hand_player[player_card_idx];
    game_data.hand_player[player_card_idx] = 0;

    // AI picks a card
    int ai_card_idx = ai_choose_card(game_data);
    game_data.selected_card_ai = game_data.hand_ai[ai_card_idx];
    game_data.hand_ai[ai_card_idx] = 0;

    resolve_selected_cards(game_data);
  });
}

EOSIO_DISPATCH(cardgame, (login)(startgame)(playcard))