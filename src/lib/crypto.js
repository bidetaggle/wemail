import { arweave } from './arweave-helper'

const decryptEmail = async (enc_data, decryptKey) => {
  enc_data = arweave.utils.b64UrlToBuffer(enc_data)
  let enc_key = new Uint8Array(enc_data.slice(0, 512))
  let enc_mail = new Uint8Array(enc_data.slice(512))

  let symmetric_key = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, decryptKey, enc_key)

  return arweave.utils.bufferToString(await arweave.crypto.decrypt(enc_mail, symmetric_key))
}

const jwkToDecryptKey = async (jwk) => {
  var w = Object.create(jwk)
  w.alg = 'RSA-OAEP-256'
  w.ext = true

  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

  return await window.crypto.subtle.importKey('jwk', w, algo, false, ['decrypt'])
}

const getPublicKey = async address => {
  var txid = await arweave.wallets.getLastTransactionID(address.trim())

  if (txid === ''
  || txid === 'Invalid address.'
  || txid === 'Request type not found.')
    return false

  var tx = await arweave.transactions.get(txid)
  if (tx === undefined) return false

  // Why is this here !???
  // var pub_key = arweave.utils.b64UrlToBuffer(tx.owner)

  var keyData = {
    kty: 'RSA',
    e: 'AQAB',
    n: tx.owner,
    alg: 'RSA-OAEP-256',
    ext: true
  }
  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

  return await window.crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt'])
}

const encryptEmail = async ({ content, subject }, pub_key) => {
  let content_encoder = new TextEncoder()
  let newFormat = JSON.stringify({ 'subject': subject, 'body': content })
  let mail_buf = content_encoder.encode(newFormat)
  let key_buf = await window.crypto.getRandomValues(new Uint8Array(256))

  // Encrypt data segments
  let encrypted_mail =
	await arweave.crypto.encrypt(mail_buf, key_buf)
  let encrypted_key =
	await window.crypto.subtle.encrypt(
	    {
	        name: 'RSA-OAEP'
	    },
	    pub_key,
	    key_buf
	)

  // Concatenate and return them
  return arweave.utils.concatBuffers([encrypted_key, encrypted_mail])
}

export {
  decryptEmail,
  jwkToDecryptKey,
  getPublicKey,
  encryptEmail
};
