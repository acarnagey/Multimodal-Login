const common = require("../common/common");
const Crypto = require("crypto");

module.exports = {
  store: async (guid, key) => {
    return await module.exports.storeToDb(guid, JSON.stringify(key));
  },
  retrieve: async (guid) => {
    const keyString = await module.exports.retrieveFromDb(guid);
    return JSON.parse(keyString);
  },

  storeToDb: async (guid, key) => {
    let cipher = Crypto.createCipher("aes-256-cbc", process.env.AUTH_SECRET);
    let encryptedKey = cipher.update(key, "utf8", "hex");
    encryptedKey += cipher.final("hex");

    await common.dbClient.store(guid, encryptedKey);
  },

  retrieveFromDb: async (guid) => {
    const keyObj = await common.dbClient.retrieve(guid);

    let decipher = Crypto.createDecipher(
      "aes-256-cbc",
      process.env.AUTH_SECRET
    );

    let decryptedKey = decipher.update(keyObj.encryptedKey, "hex", "utf8");
    decryptedKey += decipher.final("utf8");

    return decryptedKey;
  },
};
