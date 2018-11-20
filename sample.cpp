#include <eosiolib/eosio.hpp>

class [[eosio::contract]] nameofclass : public eosio::contract {
  public:
  [[eosio::action]]
  void action1(/*action parameters*/) {
    /*action body*/
  };

  private:
  struct [[eosio::table]] table_name {
    uint64_t key;
    /*more fields here*/

    auto primary_key() const { return key; }
  };
};

EOSIO_DISPATCH( nameofclass, (action1) )