import { Api, Rpc, SignatureProvider } from 'eosjs';

// Main action call to blockchain
async function takeAction(action, dataValue) {
  const privateKey = localStorage.getItem("cardgame_key");
  const rpc = new Rpc.JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
  const signatureProvider = new SignatureProvider([privateKey]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  // Main call to blockchain after setting action, account_name and data
  try {
    const resultWithConfig = await api.transact({
      actions: [{
        account: process.env.REACT_APP_EOS_CONTRACT_NAME,
        name: action,
        authorization: [{
          actor: localStorage.getItem("cardgame_account"),
          permission: 'active',
        }],
        data: dataValue,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    return resultWithConfig;
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

  static login({ username, key }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("cardgame_account", username);
      localStorage.setItem("cardgame_key", key);
      takeAction("login", { username: username })
        .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static async getUserByName(username) {
    try {
      const rpc = new Rpc.JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
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
