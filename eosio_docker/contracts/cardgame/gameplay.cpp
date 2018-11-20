#include "cardgame.hpp"

// Simple Pseudo Random Number Algorithm, randomly pick a number within 0 to n-1
int cardgame::random(const int range) {
  // Find the existing seed
  auto seed_iterator = _seed.begin();

  // Initialize the seed with default value if it is not found
  if (seed_iterator == _seed.end()) {
    seed_iterator = _seed.emplace( _self, [&]( auto& seed ) { });
  }

  // Generate new seed value using the existing seed value
  int prime = 65537;
  auto new_seed_value = (seed_iterator->value + now()) % prime;
  
  // Store the updated seed value in the table
  _seed.modify( seed_iterator, _self, [&]( auto& s ) {
    s.value = new_seed_value;
  });
  
  // Get the random result in desired range
  int random_result = new_seed_value % range;
  return random_result;
}

// Draw one card from the deck and assign it to the hand
void cardgame::draw_one_card(vector<uint8_t>& deck, vector<uint8_t>& hand) {
  // Pick a random card from the deck
  int deck_card_idx = random(deck.size());

  // Find the first empty slot in the hand
  int first_empty_slot = -1;
  for (int i = 0; i <= hand.size(); i++) {
    auto id = hand[i];
    if (card_dict.at(id).type == EMPTY) {
      first_empty_slot = i;
      break;
    }
  }
  eosio_assert(first_empty_slot != -1, "No empty slot in the player's hand");

  // Assign the card to the first empty slot in the hand
  hand[first_empty_slot] = deck[deck_card_idx];
  
  // Remove the card from the deck
  deck.erase(deck.begin() + deck_card_idx);
}