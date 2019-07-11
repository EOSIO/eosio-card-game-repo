FROM ubuntu:18.04

RUN apt-get update && apt-get install -y wget sudo curl
RUN wget https://github.com/EOSIO/eosio.cdt/releases/download/v1.6.1/eosio.cdt_1.6.1-1_amd64.deb
RUN apt-get update && sudo apt install -y ./eosio.cdt_1.6.1-1_amd64.deb
RUN wget https://github.com/EOSIO/eos/releases/download/v1.8.1/eosio_1.8.1-1-ubuntu-18.04_amd64.deb
RUN apt-get update && sudo apt install -y ./eosio_1.8.1-1-ubuntu-18.04_amd64.deb
