import { decryptEmail, jwkToDecryptKey } from './crypto'
import { arweave, getTransactionById } from './arweave-helper'

function timeConverter (UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000)
  var year = a.getFullYear()
  var month = ('0'+(a.getMonth()+1)).slice(-2)
  var date = ('0'+(a.getDate())).slice(-2)
  var hour = ('0'+(a.getHours())).slice(-2)
  var min = ('0'+(a.getMinutes())).slice(-2)
  var sec = ('0'+(a.getSeconds())).slice(-2)
  var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec
  return time
}

const arqlToMails = async (arqlData, decryptKey, folder) => await Promise.all(arqlData.map(async (id, i) => {
  let txDecoded = await getTransactionById(id)

  let mail = await decryptEmail(txDecoded.data, decryptKey)
  try {
      mail = JSON.parse(mail);
  } catch (e) {}

  // Upgrade old format.
  if (typeof mail === 'string') mail = { subject: id, body: mail }

  // Validation
  if (typeof mail !== 'object' || typeof mail.body !== 'string' || typeof mail.subject !== 'string')
    mail = { subject: id, body: `Unexpected mail format: ${mail}` }

  //refactor mail object
  return {
    address: txDecoded.owner,
    from: txDecoded.owner,
    id: id,
    message: mail.body,
    read: false,
    subject: mail.subject,
    tag: folder,
    time: txDecoded?.tags['Unix-Time'] ? timeConverter(txDecoded.tags['Unix-Time']) : null
  };
}))

let refreshInbox = async (user) => {

  let decryptKey = await jwkToDecryptKey(user.jwk)

  let res = await arweave.api.post(`arql`, {
    op: 'and',
    expr1:
		{
		  op: 'equals',
		  expr1: 'to',
		  expr2: user.address
		},
    expr2:
		{
		  op: 'equals',
		  expr1: 'App-Name',
		  expr2: 'permamail'
		}
	})
  const inbox = await arqlToMails(res.data, decryptKey, "inbox")

  let res2 = await arweave.api.post(`arql`, {
    op: 'and',
    expr1:
		{
		  op: 'equals',
		  expr1: 'from',
		  expr2: user.address
		},
    expr2:
		{
		  op: 'equals',
		  expr1: 'App-Name',
		  expr2: 'permamail'
		}
	})
  console.log(res2.data);
  const sent = await Promise.all(res2.data.map(async (id, i) => {

    let txDecoded = await getTransactionById(id)
    console.log(txDecoded.target);

    //refactor mail object
    return {
      address: txDecoded.target,
      from: txDecoded.target,
      id: id,
      message: 'message body is encrypted',
      read: true,
      subject: 'subject is encrypted',
      tag: "sent",
      time: txDecoded?.tags['Unix-Time'] ? timeConverter(txDecoded.tags['Unix-Time']) : null
    }
  }))

  return inbox.concat(sent)
}
export default refreshInbox;
