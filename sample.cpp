#include <eosiolib/eosio.hpp>

class nameofclass : public eosio::contract {
  public:
  void action1(/*action parameters*/) {
    /*action body*/
  };

  private:
  // @abi table users
  struct table_name {
    uint64_t key;
    /*more fields here*/

    auto primary_key() const { return key; }
  };
};

EOSIO_ABI( nameofclass, (action1) )
