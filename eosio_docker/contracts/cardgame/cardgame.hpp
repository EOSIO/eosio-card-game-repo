#include <eosiolib/eosio.hpp>

using namespace std;
class cardgame : public eosio::contract {

  public:

    cardgame( account_name self ):contract(self){}

};
