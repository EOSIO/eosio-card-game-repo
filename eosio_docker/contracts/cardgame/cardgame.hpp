#include <eosiolib/eosio.hpp>

using namespace std;
class cardgame : public eosio::contract {

  private:

    // @abi table users
    struct user_info {
      account_name    name;
      uint16_t        win_count = 0;
      uint16_t        lost_count = 0;

      auto primary_key() const { return name; }
    };

    typedef eosio::multi_index<N(users), user_info> users_table;

    users_table _users;

  public:

    cardgame( account_name self ):contract(self),_users(self, self){}

    void login(account_name username);

};
