
const decryptEmail = async (arweave, enc_data, decryptKey) => {
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

export { decryptEmail, jwkToDecryptKey };
