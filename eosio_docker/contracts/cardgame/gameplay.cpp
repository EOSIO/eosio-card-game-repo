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

// Calculate the final attack point of a card after taking the elemental bonus into account
int cardgame::calculate_attack_point(const card& card1, const card& card2) {
  int result = card1.attack_point;

  //Add elemental compatibility bonus of 1
  if ((card1.type == FIRE && card2.type == WOOD) ||
      (card1.type == WOOD && card2.type == WATER) ||
      (card1.type == WATER && card2.type == FIRE)) {
    result++;
  }

  return result;
}

// AI Best Card Win Strategy
int cardgame::ai_best_card_win_strategy(const int ai_attack_point, const int player_attack_point) {
  eosio::print("Best Card Wins");
  if (ai_attack_point > player_attack_point) return 3;
  if (ai_attack_point < player_attack_point) return -2;
  return -1;
}

// AI Minimize Loss Strategy
int cardgame::ai_min_loss_strategy(const int ai_attack_point, const int player_attack_point) {
  eosio::print("Minimum Losses");
  if (ai_attack_point > player_attack_point) return 1;
  if (ai_attack_point < player_attack_point) return -4;
  return -1;
}

// AI Points Tally Strategy
int cardgame::ai_points_tally_strategy(const int ai_attack_point, const int player_attack_point) {
  eosio::print("Points Tally");
  return ai_attack_point - player_attack_point;
}

// AI Loss Prevention Strategy
int cardgame::ai_loss_prevention_strategy(const int8_t life_ai, const int ai_attack_point, const int player_attack_point) {
  eosio::print("Loss Prevention");
  if (life_ai + ai_attack_point - player_attack_point > 0) return 1;
  return 0;
}

// Calculate the score for the current ai card given the  strategy and the player hand cards
int cardgame::calculate_ai_card_score(const int strategy_idx, 
                                      const int8_t life_ai,
                                      const card& ai_card, 
                                      const vector<uint8_t> hand_player) {
   int card_score = 0;
   for (int i = 0; i < hand_player.size(); i++) {
      const auto player_card_id = hand_player[i];
      const auto player_card = card_dict.at(player_card_id);

      int ai_attack_point = calculate_attack_point(ai_card, player_card);
      int player_attack_point = calculate_attack_point(player_card, ai_card);

      // Accumulate the card score based on the given strategy
      switch (strategy_idx) {
        case 0: {
          card_score += ai_best_card_win_strategy(ai_attack_point, player_attack_point);
          break;
        }
        case 1: {
          card_score += ai_min_loss_strategy(ai_attack_point, player_attack_point);
          break;
        }
        case 2: {
          card_score += ai_points_tally_strategy(ai_attack_point, player_attack_point);
          break;
        }
        default: {
          card_score += ai_loss_prevention_strategy(life_ai, ai_attack_point, player_attack_point);
          break;
        }
      }
    }
    return card_score;
}

// Chose a card from the AI's hand based on the current game data
int cardgame::ai_choose_card(const game& game_data) {
  // The 4th strategy is only chosen in the dire situation
  int available_strategies = 4; 
  if (game_data.life_ai > 2) available_strategies--; 
  int strategy_idx = random(available_strategies);
 
  // Calculate the score of each card in the AI hand 
  int chosen_card_idx = -1;
  int chosen_card_score = std::numeric_limits<int>::min(); 

  for (int i = 0; i < game_data.hand_ai.size(); i++) {
    const auto ai_card_id = game_data.hand_ai[i];
    const auto ai_card = card_dict.at(ai_card_id);

    // Ignore empty slot in the hand
    if (ai_card.type == EMPTY) continue;

    // Calculate the score for this AI card relative to the player's hand cards
    auto card_score = calculate_ai_card_score(strategy_idx, game_data.life_ai, ai_card, game_data.hand_player);

    // Keep track of the card that has the highest score
    if (card_score > chosen_card_score) {
      chosen_card_score = card_score;
      chosen_card_idx = i;
    }
  }
  return chosen_card_idx;
}

// Resolve selected cards and update the damage dealt
void cardgame::resolve_selected_cards(game& game_data) {
  const auto player_card = card_dict.at(game_data.selected_card_player);
  const auto ai_card = card_dict.at(game_data.selected_card_ai);

  // For type VOID, we will skip any damage calculation
  if (player_card.type == VOID || ai_card.type == VOID) return;

  int player_attack_point = calculate_attack_point(player_card, ai_card);
  int ai_attack_point =  calculate_attack_point(ai_card, player_card);

  // Damage calculation
  if (player_attack_point > ai_attack_point) {
    // Deal damage to the AI if the AI card's attack point is higher
    int diff = player_attack_point - ai_attack_point;
    game_data.life_lost_ai = diff;
    game_data.life_ai -= diff;
  } else if (ai_attack_point > player_attack_point) {
    // Deal damage to the player if the player card's attack point is higher
    int diff = ai_attack_point - player_attack_point;
    game_data.life_lost_player = diff;
    game_data.life_player -= diff;
  }
}