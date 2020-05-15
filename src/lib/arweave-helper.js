import Arweave from 'arweave/web'
const arweave = Arweave.init()

/*
 *  Get transactions data with:
 *  - decoded tags from an id transaction
 *  - decoded owner address
 */

const getTransactionById = async (id) => {
  let tx = await arweave.transactions.get(id)
  tx.get('tags').forEach(tag => {
    let key = tag.get('name', { decode: true, string: true })
    let value = tag.get('value', { decode: true, string: true })
    tx.tags[key] = value
  })

  tx.owner = await arweave.wallets.ownerToAddress(tx.owner)
  return tx;
}

export {
  arweave,
  getTransactionById
};
