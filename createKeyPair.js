const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./public/assets/event-organizer-storage-account-dump.json', JSON.stringify(account))