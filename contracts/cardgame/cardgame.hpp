#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;
class [[eosio::contract]] cardgame : public eosio::contract {

  private:

    enum game_status: int8_t  {
      ONGOING     = 0,
      PLAYER_WON   = 1,
      PLAYER_LOST  = -1
    };

    enum card_type: uint8_t {
      EMPTY = 0, // Represents empty slot in hand
      FIRE = 1,
      WOOD = 2,
      WATER = 3,
      NEUTRAL = 4,
      VOID = 5 
    };

    struct card {
      uint8_t type;
      uint8_t attack_point;
    };
    
    const map<uint8_t, card> card_dict = {
      { 0, {EMPTY, 0} },       
      { 1, {FIRE, 1} },
      { 2, {FIRE, 1} },
      { 3, {FIRE, 2} },
      { 4, {FIRE, 2} },
      { 5, {FIRE, 3} },
      { 6, {WOOD, 1} },
      { 7, {WOOD, 1} },
      { 8, {WOOD, 2} },
      { 9, {WOOD, 2} },
      { 10, {WOOD, 3} }, 
      { 11, {WATER, 1} },
      { 12, {WATER, 1} },
      { 13, {WATER, 2} },
      { 14, {WATER, 2} },
      { 15, {WATER, 3} },
      { 16, {NEUTRAL, 3} }, 
      { 17, {VOID, 0} }
    };
    
    struct game {
      int8_t          life_player = 5;
      int8_t          life_ai = 5;
      vector<uint8_t> deck_player = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17};   
      vector<uint8_t> deck_ai = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17}; 
      vector<uint8_t> hand_player = {0, 0, 0, 0};   
      vector<uint8_t> hand_ai = {0, 0, 0, 0};   
      uint8_t         selected_card_player = 0;             
      uint8_t         selected_card_ai = 0;   
      uint8_t         life_lost_player = 0;
      uint8_t         life_lost_ai = 0;
      int8_t          status = ONGOING;
    };

    struct [[eosio::table]] user_info {
      name            username;
      uint16_t        win_count = 0;
      uint16_t        lost_count = 0;
      game            game_data;

      auto primary_key() const { return username.value; }
    };

    struct [[eosio::table]] seed {
      uint64_t        key = 1;
      uint32_t        value = 1;

      auto primary_key() const { return key; }
    };

    typedef eosio::multi_index<name("users"), user_info> users_table;

    typedef eosio::multi_index<name("seed"), seed> seed_table;

    users_table _users;

    seed_table _seed;

    void draw_one_card(vector<uint8_t>& deck, vector<uint8_t>& hand);

    int calculate_attack_point(const card& card1, const card& card2);

    int ai_best_card_win_strategy(const int ai_attack_point, const int player_attack_point);

    int ai_min_loss_strategy(const int ai_attack_point, const int player_attack_point);

    int ai_points_tally_strategy(const int ai_attack_point, const int player_attack_point);

    int ai_loss_prevention_strategy(const int8_t life_ai, const int ai_attack_point, const int player_attack_point);

    int calculate_ai_card_score(const int strategy_idx, const int8_t life_ai, 
                                const card& ai_card, const vector<uint8_t> hand_player);

    int ai_choose_card(const game& game_data);

    void resolve_selected_cards(game& game_data);

    int random(const int range);

  public:

    cardgame( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
                       _users(receiver, receiver.value),
                       _seed(receiver, receiver.value) {}

    [[eosio::action]]
    void login(name username);

    [[eosio::action]]
    void startgame(name username);

    [[eosio::action]]
    void playcard(name username, uint8_t player_card_idx);

};
