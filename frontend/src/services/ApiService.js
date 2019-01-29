import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'

// Main action call to blockchain
async function takeAction(action, dataValue) {
  try {
    var account_name = localStorage.getItem("cardgame_account");
    if (account_name) {
      var eosWallet = window.eosWallet;
      var resultWithConfig = await eosWallet.sendCustomAction(process.env.REACT_APP_EOS_CONTRACT_NAME, action, dataValue);
      return resultWithConfig;
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    throw(err)
  }
}

class ApiService {

  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("cardgame_account")) {
        return reject();
      }
      takeAction("login", { username: localStorage.getItem("cardgame_account") })
        .then(() => {
          resolve(localStorage.getItem("cardgame_account"));
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static login() {
    return new Promise(async (resolve, reject) => {
      var eosWallet = window.eosWallet;
      var { data, status } = await eosWallet.connect();
      if (status == "success") {
        var username = data["account_name"];
        localStorage.setItem("cardgame_account", username);
        takeAction("login", { username })
          .then(() => {
            resolve(username);
          })
          .catch(err => {
            localStorage.removeItem("cardgame_account");
            localStorage.removeItem("cardgame_key");
            reject(err);
          });
      } else {
        reject("No permission")
      }
    });
  }

  static startGame() {
    return takeAction("startgame", { username: localStorage.getItem("cardgame_account") });
  }

  static playCard(cardIdx) {
    return takeAction("playcard", { username: localStorage.getItem("cardgame_account"), player_card_idx: cardIdx });
  }

  static nextRound() {
    return takeAction("nextround", { username: localStorage.getItem("cardgame_account") });
  }

  static endGame() {
    return takeAction("endgame", { username: localStorage.getItem("cardgame_account") });
  }

  static async getUserByName(username) {
    try {
      const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        "json": true,
        "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
        "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
        "limit": 1,
        "lower_bound": username,
      });
      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

}

export default ApiService;
