import { decryptEmail, jwkToDecryptKey } from './crypto'

let refreshInbox = async (arweave, user) => {

  const res = await arweave.api.post(`arql`, {
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

  let decryptKey = await jwkToDecryptKey(user.jwk)

  const inbox = await Promise.all(res.data.map(async (id, i) => {
    let tx = await arweave.transactions.get(id)
    let mail = await decryptEmail(arweave, tx.data, decryptKey)
    try {
        mail = JSON.parse(mail);
    } catch (e) {}

    // Upgrade old format.
    if (typeof mail === 'string') {
      mail = {
        body: mail,
        subject: id,
      }
    }

    // Validate
    if (typeof mail !== 'object' || typeof mail.body !== 'string' || typeof mail.subject !== 'string') {
      mail = {
        body: `Unexpected mail format: ${mail}`,
        subject: id
      }
    }

    let unixTime = null
    tx.get('tags').forEach(tag => {
      let key = tag.get('name', { decode: true, string: true })
      let value = tag.get('value', { decode: true, string: true })
      if (key === 'Unix-Time') unixTime = value
    })

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

    //refactor mail object
    mail = {
      address: await arweave.wallets.ownerToAddress(tx.owner),
      from: await arweave.wallets.ownerToAddress(tx.owner),
      id: id,
      message: mail.body,
      read: false,
      subject: mail.subject,
      tag: "inbox",
      time: timeConverter(unixTime)
    }
    return mail;
  }))

  return inbox;
}
export default refreshInbox;
