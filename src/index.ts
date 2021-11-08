#!/usr/bin/env node

// import necessary files
import {
  writeFileSync,
  readdirSync,
  readFileSync,
  existsSync,
  copyFileSync,
  mkdirSync,
  renameSync,
  chmodSync,
  PathLike,
} from 'fs'
import * as os from 'os'
// import meow from 'meow'
import * as rmdir from 'rimraf'
import * as forge from 'node-forge'
import keypair from 'keypair'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// Get path for work
const HOME_PATH = `${os.homedir()}/`
const SSH_PATH = `${HOME_PATH}.ssh/`
const SWITCH_FILE = `${SSH_PATH}.sshwitch`

// Get the all directory aka keys
export const getDirectories = (source: PathLike): string[] =>
  readdirSync(source, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

// Get current key
export const getCurrent = (): string => {
  try {
    return readFileSync(SWITCH_FILE).toString()
  } catch (e) {
    writeFileSync(SWITCH_FILE, '')
    return readFileSync(SWITCH_FILE).toString()
  }
}

// get all ssh keys
export const getList = (): string[] => {
  getDirectories(SSH_PATH).map((item) => console.log(item))
  return getDirectories(SSH_PATH)
}

// Switch ssh key
// eslint-disable-next-line no-undef
export const switchKey = (name: string | NodeJS.ArrayBufferView): void => {
  try {
    if (
      existsSync(`${SSH_PATH + name}/id_rsa`) &&
      existsSync(`${SSH_PATH + name}/id_rsa.pub`)
    ) {
      try {
        copyFileSync(`${SSH_PATH + name}/id_rsa`, `${SSH_PATH}id_rsa`)
        copyFileSync(`${SSH_PATH + name}/id_rsa.pub`, `${SSH_PATH}id_rsa.pub`)
        writeFileSync(SWITCH_FILE, name)
        chmodSync(`${SSH_PATH}/id_rsa.pub`, 0o600)
        chmodSync(`${SSH_PATH}/id_rsa`, 0o600)
        return console.log(`Changed key pair to: ${name}`)
      } catch (err) {
        console.log(
          `Could not copy, check if you have permission to write on ${SSH_PATH}`
        )
        return console.error(err)
      }
    } else {
      console.log(`Could not read key pair in ${SSH_PATH + name}`)
      console.log(`Check if key pair exists in ${SSH_PATH + name}\n\n`)
      console.log(`If not you can create a new one with: "sshmulti -n ${name}"`)
      return console.log(
        `Or backup the current key pair in ${SSH_PATH} with: "sshmulti -b ${name}"`
      )
    }
  } catch (err) {
    return console.error(err)
  }
}

// Register new ssh key
export const newKey = (name: string): void => {
  if (existsSync(SSH_PATH + name)) {
    return console.log(`${SSH_PATH + name} already exists, skipping`)
  }
  console.log(`Creating key pair in ${SSH_PATH + name}`)
  try {
    mkdirSync(SSH_PATH + name)
    const pair = keypair()
    const publicKey = forge.pki.publicKeyFromPem(pair.public)
    const privateKey = forge.pki.privateKeyFromPem(pair.private)
    const ssh = forge.ssh.publicKeyToOpenSSH(publicKey)
    const sshPrivate = forge.ssh.privateKeyToOpenSSH(privateKey)
    writeFileSync(`${SSH_PATH + name}/id_rsa.pub`, ssh)
    writeFileSync(`${SSH_PATH + name}/id_rsa`, sshPrivate)
    chmodSync(`${SSH_PATH + name}/id_rsa.pub`, 0o600)
    chmodSync(`${SSH_PATH + name}/id_rsa`, 0o600)
    return console.log(
      `\n public key: \n\n ${ssh}\n private key: \n\n ${sshPrivate}`
    )
  } catch (err) {
    console.log(
      `Could not create key pair, check if you have permission to write on ${
        SSH_PATH + name
      }`
    )
    return console.log(err)
  }
}

// backup ssh keys
export const backupKey = (name: string) => {
  if (existsSync(SSH_PATH + name)) {
    return console.log(`${SSH_PATH + name} already exists, skipping`)
  }
  console.log(`Copying current key pair in ${SSH_PATH} to ${SSH_PATH + name}`)
  try {
    mkdirSync(SSH_PATH + name)
    copyFileSync(`${SSH_PATH}id_rsa`, `${SSH_PATH + name}/id_rsa`)
    copyFileSync(`${SSH_PATH}id_rsa.pub`, `${SSH_PATH + name}/id_rsa.pub`)
    return console.log(
      `Backup to current key pair in ${SSH_PATH} to ${SSH_PATH + name}`
    )
  } catch (err) {
    console.log(
      `Could not backup key pair, check if you have permission to write on ${
        SSH_PATH + name
      }`
    )
    return console.log(err)
  }
}

// Rename ssh key
export const renameKey = (oldName: string, newName: string) => {
  if (!existsSync(SSH_PATH + oldName)) {
    return console.log(`${SSH_PATH + oldName} doesn't exists, cannot rename`)
  }
  if (existsSync(SSH_PATH + newName)) {
    return console.log(`${SSH_PATH + newName} already exists, cannot rename`)
  }
  try {
    renameSync(SSH_PATH + oldName, SSH_PATH + newName)
    if (getCurrent() === oldName) {
      writeFileSync(SWITCH_FILE, newName)
      switchKey(newName)
    }
    return console.log('Renamed the current key')
  } catch (err) {
    console.log('Could not rename')
    return console.log(err)
  }
}

// delete ssh key
export const deleteKey = (name: string): void => {
  try {
    rmdir.sync(SSH_PATH + name)
    return console.log(`Deleted ${name} sshkey.`)
  } catch (e) {
    return console.log(e)
  }
}
// Using argv for taking flag and input

const argv = yargs(hideBin(process.argv))
  .usage(
    `
    Switch and manage key pairs in ${SSH_PATH}
    Default usage: sshmulti key_pair_name
    Advanced usage: sshmulti [option]
    -c, --current                    Get name of current key pair
    -n, --new                        New key pair name
    -b, --backup                     Backup key pair in ${SSH_PATH}
    -r, --rename                     Rename a key pair
    -l, --list                       Get list of key pairs in ${SSH_PATH}
    -d, --delete DELETE              Delete key pair
    `
  )
  .help('help')
  .alias('help', 'h')
  .version('version', '1.0.1')
  .alias('version', 'V')
  .options({
    backup: { type: 'boolean', alias: ['backup', 'b'], default: false },
    new: { type: 'boolean', alias: ['new', 'n'], default: false },
    rename: { type: 'boolean', alias: ['rename', 'r'], default: false },
    list: { type: 'boolean', alias: ['list', 'l'], default: false },
    current: { type: 'boolean', alias: ['current', 'c'], default: false },
    delete: { type: 'boolean', alias: ['delete', 'd'], default: false },
  }).argv

// Let the fun began
const isBackup = argv.backup
const isCurrent = argv.current
const isDelete = argv.delete
const isList = argv.list
const isRename = argv.rename
const isNew = argv.new
const name = argv._ || ''
switch (true) {
  case isBackup && name[0].toString()?.length === 1:
    backupKey(name[0].toString())
    break
  case isRename && name.length === 2:
    // eslint-disable-next-line no-case-declarations
    if (name[0] && name[1]) {
      renameKey(name[0].toString(), name[1].toString())
    } else {
      console.log('Please enter valid name. Type sshmulti --help for more.')
    }
    break
  case isNew && name.length === 1:
    newKey(name[0].toString())
    break
  case isDelete && name.length === 1:
    deleteKey(name[0].toString())
    break
  case isList:
    getList()
    break
  case isCurrent || name.length === 0:
    console.log(getCurrent())
    break
  case !isBackup &&
    !isCurrent &&
    !isDelete &&
    !isList &&
    !isRename &&
    !isNew &&
    name.length === 1:
    switchKey(name[0].toString())
    break
  case name.length > 1:
    console.log('Enter sshmulti --help for more command')
    break
  default:
    console.log(getCurrent())
    break
}

export default getDirectories
