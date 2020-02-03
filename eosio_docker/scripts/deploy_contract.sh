#!/usr/bin/env bash
set -o errexit

# set PATH
PATH="$PATH:/opt/eosio/bin"

CONTRACTSPATH="$( pwd -P )/contracts"

# make new directory for compiled contract files
mkdir -p ./compiled_contracts
mkdir -p ./compiled_contracts/$1

COMPILEDCONTRACTSFOLDER="compiled_contracts"
COMPILEDCONTRACTSPATH="$( pwd -P )/$COMPILEDCONTRACTSFOLDER"

# unlock the wallet, ignore error if already unlocked
if [ ! -z $3 ]; then cleos wallet unlock -n $3 --password $4 || true; fi

# compile smart contract to wasm and abi files using EOSIO.CDT (Contract Development Toolkit)
# https://github.com/EOSIO/eosio.cdt
(
  eosio-cpp -abigen "$CONTRACTSPATH/$1/$1.cpp" -o "$COMPILEDCONTRACTSPATH/$1/$1.wasm" --contract "$1"
) &&

# set (deploy) compiled contract to blockchain if an abi file is found in compiled contracts folder
if [ -f "$COMPILEDCONTRACTSFOLDER/$1/$1.abi" ]; then
  cleos set contract $2 "$COMPILEDCONTRACTSFOLDER/$1" --permission $2
else
  cleos set code $2 "$COMPILEDCONTRACTSFOLDER/$1/$1.wasm" --permission $2
fi
