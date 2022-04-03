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
import * as rmdir from 'rimraf'
import * as forge from 'node-forge'
import keypair from 'keypair'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// Get path for work
export const HOME_PATH = `${os.homedir()}/`
export const SSH_PATH = `${HOME_PATH}.ssh/`
export const SWITCH_FILE = `${SSH_PATH}.sshwitch`

// get buffer to string
export const bufferToString = (buffer: string | Buffer | undefined = '') =>
  buffer.toString()

// Get the all directory aka keys
export const getDirectories = (source: PathLike): string[] => {
  return readdirSync(source, {
    withFileTypes: true,
  })
    ?.filter((dirent) => dirent.isDirectory())
    ?.map((dirent) => dirent.name)
}

// Get current key
export const getCurrent = (): string => {
  try {
    return readFileSync(SWITCH_FILE).toString()
  } catch (e) {
    writeFileSync(SWITCH_FILE, '')
    return bufferToString(readFileSync(SWITCH_FILE))
  }
}

// get all ssh keys
export const getList = (): string[] => {
  getDirectories(SSH_PATH)?.map((item) => console.log(item))
  return getDirectories(SSH_PATH)
}

// Switch ssh key
export const switchKey = (keyName: string | NodeJS.ArrayBufferView): void => {
  try {
    if (
      existsSync(`${SSH_PATH + keyName}/id_rsa`) &&
      existsSync(`${SSH_PATH + keyName}/id_rsa.pub`)
    ) {
      try {
        copyFileSync(`${SSH_PATH + keyName}/id_rsa`, `${SSH_PATH}id_rsa`)
        copyFileSync(
          `${SSH_PATH + keyName}/id_rsa.pub`,
          `${SSH_PATH}id_rsa.pub`
        )
        writeFileSync(SWITCH_FILE, keyName)
        chmodSync(`${SSH_PATH}/id_rsa.pub`, 0o600)
        chmodSync(`${SSH_PATH}/id_rsa`, 0o600)
        return console.log(`Changed key pair to: ${keyName}`)
      } catch (err) {
        console.log(
          `Could not copy, check if you have permission to write on ${SSH_PATH}`
        )
        return console.error(err)
      }
    } else {
      console.log(`Could not read key pair in ${SSH_PATH + keyName}`)
      console.log(`Check if key pair exists in ${SSH_PATH + keyName}\n\n`)
      console.log(
        `If not you can create a new one with: "sshmulti -n ${keyName}"`
      )
      return console.log(
        `Or backup the current key pair in ${SSH_PATH} with: "sshmulti -b ${keyName}"`
      )
    }
  } catch (err) {
    return console.error(err)
  }
}

// Register new ssh key
export const newKey = (newName: string): void => {
  if (existsSync(SSH_PATH + newName)) {
    return console.log(`${SSH_PATH + newName} already exists, skipping`)
  }
  console.log(`Creating key pair in ${SSH_PATH + newName}`)
  try {
    mkdirSync(SSH_PATH + newName)
    const pair = keypair()
    const publicKey = forge.pki.publicKeyFromPem(pair.public)
    const privateKey = forge.pki.privateKeyFromPem(pair.private)
    const ssh = forge.ssh.publicKeyToOpenSSH(publicKey)
    const sshPrivate = forge.ssh.privateKeyToOpenSSH(privateKey)
    writeFileSync(`${SSH_PATH + newName}/id_rsa.pub`, ssh)
    writeFileSync(`${SSH_PATH + newName}/id_rsa`, sshPrivate)
    chmodSync(`${SSH_PATH + newName}/id_rsa.pub`, 0o600)
    chmodSync(`${SSH_PATH + newName}/id_rsa`, 0o600)
    copyFileSync(`${SSH_PATH + newName}/id_rsa`, `${SSH_PATH}id_rsa`)
    copyFileSync(`${SSH_PATH + newName}/id_rsa.pub`, `${SSH_PATH}id_rsa.pub`)
    writeFileSync(SWITCH_FILE, newName)
    return console.log(
      `\n public key: \n\n ${ssh}\n private key: \n\n ${sshPrivate}`
    )
  } catch (err) {
    console.log(
      `Could not create key pair, check if you have permission to write on ${
        SSH_PATH + newName
      }`
    )
    return console.log(err)
  }
}

// backup ssh keys
export const backupKey = (oldName: string) => {
  if (existsSync(SSH_PATH + oldName)) {
    return console.log(`${SSH_PATH + oldName} already exists, skipping`)
  }
  console.log(
    `Copying current key pair in ${SSH_PATH} to ${SSH_PATH + oldName}`
  )
  try {
    mkdirSync(SSH_PATH + oldName)
    copyFileSync(`${SSH_PATH}id_rsa`, `${SSH_PATH + oldName}/id_rsa`)
    copyFileSync(`${SSH_PATH}id_rsa.pub`, `${SSH_PATH + oldName}/id_rsa.pub`)
    return console.log(
      `Backup to current key pair in ${SSH_PATH} to ${SSH_PATH + oldName}`
    )
  } catch (err) {
    console.log(
      `Could not backup key pair, check if you have permission to write on ${
        SSH_PATH + oldName
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
    return console.log(`Renamed ${oldName} key to ${newName}`)
  } catch (err) {
    console.log('Could not rename key pair')
    return console.log(err)
  }
}

// delete ssh key
export const deleteKey = (deletedName: string): void => {
  if (!existsSync(SSH_PATH + deletedName)) {
    return console.log(
      `${SSH_PATH + deletedName} doesn't exists, cannot delete`
    )
  }
  try {
    rmdir.sync(SSH_PATH + deletedName)
    return console.log(`Deleted ${deletedName} sshkey.`)
  } catch (e) {
    return console.log(e)
  }
}
// Using argv for taking flag and input

export const parsedArg = yargs(hideBin(process.argv))
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
  .version('version', '3.0.3')
  .alias('version', 'V')
  .options({
    backup: { type: 'boolean', alias: ['backup', 'b'], default: false },
    new: { type: 'boolean', alias: ['new', 'n'], default: false },
    rename: { type: 'boolean', alias: ['rename', 'r'], default: false },
    list: { type: 'boolean', alias: ['list', 'l'], default: false },
    current: { type: 'boolean', alias: ['current', 'c'], default: false },
    delete: { type: 'boolean', alias: ['delete', 'd'], default: false },
  }).argv

export const handleCommand = (argv: {
  [x: string]: unknown
  backup: boolean
  new: boolean
  rename: boolean
  list: boolean
  current: boolean
  delete: boolean
  _: (string | number)[]
  $0: string
}) => {
  const {
    backup: isBackup,
    current: isCurrent,
    delete: isDelete,
    list: isList,
    rename: isRename,
    new: isNew,
    _: name,
  } = argv

  if (isBackup && name[0].toString().length >= 1) {
    return backupKey(name[0].toString())
  }
  if (isRename && name.length === 2) {
    return renameKey(name[0].toString(), name[1].toString())
  }

  if (isNew && name.length === 1) {
    return newKey(name[0].toString())
  }

  if (isDelete && name.length === 1) {
    return deleteKey(name[0].toString())
  }

  if (isList) {
    return getList()
  }

  if (isCurrent || name.length === 0) {
    return console.log(getCurrent())
  }

  if (
    !isBackup &&
    !isCurrent &&
    !isDelete &&
    !isList &&
    !isRename &&
    !isNew &&
    name.length === 1
  ) {
    return switchKey(name[0].toString())
  }

  return console.log('Please enter valid name. Type sshmulti --help for more.')
}

// Let the fun began
;(async () => {
  const argv = await parsedArg
  handleCommand(argv)
})()

export default getDirectories
