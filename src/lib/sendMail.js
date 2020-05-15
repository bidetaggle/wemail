import { getPublicKey, encryptEmail } from './crypto'
import { arweave } from './arweave-helper'

const sendMail = async (recipient, email, user) => {
  /*
   *  Validation
   */
  email.ARamount = arweave.ar.arToWinston(parseFloat(email.ARamount))
  if(!email.subject) email.subject = '[No subject]'

  // from here we don't want any change in the view
  let mail = {...email}

  if(recipient.length === 0) throw 'Please insert an address'
  let recipient_pubKey = await getPublicKey(recipient)

  if(!recipient_pubKey) throw 'Recipient has to send a transaction to the network, first!'

  /*
   *  Send the thing out!
   */

  mail.content = await encryptEmail(mail, recipient_pubKey)

  let tx = await arweave.createTransaction({
    target: recipient,
    data: await arweave.utils.concatBuffers([mail.content]),
    quantity: mail.ARamount
  }, user.jwk)

  tx.addTag('App-Name', 'permamail')
  tx.addTag('App-Version', '0.0.2')
  tx.addTag('Unix-Time', Math.round((new Date()).getTime() / 1000))

  await arweave.transactions.sign(tx, user.jwk)
  await arweave.transactions.post(tx)

  return {txid: tx.id} //everything went good
}
export default sendMail
