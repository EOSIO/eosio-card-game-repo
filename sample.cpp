#include <eosio/eosio.hpp>

class [[eosio::contract]] sample : public eosio::contract {
  public:
    using contract::contract;

    [[eosio::action]]
    void action1(/*action parameters*/) {
      /*action body*/
    };

  private:
    struct [[eosio::table]] tablename {
      uint64_t key;
      /*more fields here*/

      auto primary_key() const { return key; }
    };
};
