#include "gameplay.cpp"

void cardgame::login(account_name username) {
  // Ensure this action is authorized by the player
  require_auth(username);

  // Create a record in the table if the player doesn't exist in our app yet
  auto user_iterator = _users.find(username);
  if (user_iterator == _users.end()) {
    user_iterator = _users.emplace(username,  [&](auto& new_user) {
      new_user.name = username;
    });
  }
}

EOSIO_ABI(cardgame, (login))
