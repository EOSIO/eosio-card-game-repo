# Elemental Battles Tutorial Lesson 1

- *Account*: `player1`
- *Private Key*: `5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo`
The account information is available in [eosio_docker/scripts/accounts.json](eosio_docker/scripts/accounts.json). The key pair in this file is generated **FOR TESTING ONLY** so please **DO NOT** use them for any other purposes.

## Prerequisites

Make sure Docker and Node.js are installed

* Install Docker: https://docs.docker.com/docker-for-mac/install/
* Install Node.js: https://nodejs.org/en/

The DApp and eosio will occupy the ports 3000, 8888 and 9876. Make sure nothing else is already running on these ports.

Clone the repository:
```sh
git clone https://github.com/EOSIO/eosio-card-game-repo.git
```

The following guide assumes you are using macOS.

## Quick start - Run the DApp

In this section we provide a single command script to run all the commands needed to start both the blockchain and UI. For more detail on each component see the `Detailed guide` below.

**To start**
```sh
./quick_start.sh
```

The above command will execute the following in sequence:

1. `first_time_setup.sh`
2. `start_eosio_docker.sh`
3. `start_frontend.sh`

- Login with the following credentials:

**To stop**, press `ctrl+c` on your keyboard, and execute:
```sh
docker stop eosio_cardgame_container
```

## Detailed guide

Please refer to [eosio-project-boilerplate-simple - Detailed guide](https://github.com/EOSIO/eosio-project-boilerplate-simple/blob/master/README.md#detailed-guide) for more information. This repository is using the similar structure as that.

## Lesson List

  [Lesson 0: Before You Start](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-0)

  [Lesson 1: Smart Contract and Frontend Setup](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-1)

  [Lesson 2: Storing State and Login](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-2)

  [Lesson 3: Reading State from the Blockchain](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-3)

  [Lesson 4: Elemental Battles Core](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-4)

  [Lesson 5: Elemental Battles AI](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-5)

  [Lesson 6: Playing a Round and Elemental Compatibility](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-6)

  [Lesson 7: Building the Game Flow](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-7)

  [Lesson 8: Wrapping Up The Game](https://github.com/EOSIO/eosio-card-game-repo/tree/lesson-8)

## Contributing

See [Contributing](./Contributing.md)

## Conduct

While contributing, please be respectful and constructive, so that participation in our project is a positive experience for everyone.

Examples of behavior that contributes to creating a positive environment include:

•	Using welcoming and inclusive language
•	Being respectful of differing viewpoints and experiences
•	Gracefully accepting constructive criticism
•	Focusing on what is best for the community
•	Showing empathy towards other community members

Examples of unacceptable behavior include:

•	The use of sexualized language or imagery and unwelcome sexual attention or advances
•	Trolling, insulting/derogatory comments, and personal or political attacks
•	Public or private harassment
•	Publishing others’ private information, such as a physical or electronic address, without explicit permission
•	Other conduct which could reasonably be considered inappropriate in a professional setting

## Important

See [Copyright Notice](./CopyrightNotice.md) for copyright terms.

All repositories and other materials are provided subject to the terms of this [IMPORTANT](./ImportantNotice.md) notice and you must familiarize yourself with its terms. The notice contains important information, limitations and restrictions relating to our software, publications, trademarks, third-party resources, and forward-looking statements. By accessing any of our repositories and other materials, you accept and agree to the terms of the notice.
