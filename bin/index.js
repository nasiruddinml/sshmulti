#!/usr/bin/env node

// import necessary files
import meow from 'meow';
const {
  writeFileSync,
  readdirSync,
  readFileSync,
  existsSync,
  copyFileSync,
  mkdirSync,
  renameSync,
  chmodSync
} = require('fs');
const os = require('os');
const rmdir = require('rimraf');
const forge = require('node-forge');
const keypair = require('keypair');

// Get path for work
const HOME_PATH = os.homedir() + '/';
const SSH_PATH = HOME_PATH + '.ssh/';
const SWITCH_FILE = SSH_PATH + '.sshwitch';


// Get the all directory aka keys
const getDirectories = source =>
  readdirSync(source, {
    withFileTypes: true
  })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Get current key
const getCurrent = () => {
  try {
    return console.log(readFileSync(SWITCH_FILE).toString());
  } catch (e) {
    writeFileSync(SWITCH_FILE, '');
    return console.log(readFileSync(SWITCH_FILE).toString());
  }
};

// get all ssh keys
const getList = () => {
  getDirectories(SSH_PATH).map(item => console.log(item));
  return '';
}

// Switch ssh key
const switchKey = name => {
  try {
    if (existsSync(SSH_PATH + name + "/id_rsa") && existsSync(SSH_PATH + name + "/id_rsa.pub")) {
      try {
        copyFileSync(SSH_PATH + name + "/id_rsa", SSH_PATH + "id_rsa");
        copyFileSync(SSH_PATH + name + "/id_rsa.pub", SSH_PATH + "id_rsa.pub");
        writeFileSync(SWITCH_FILE, name);
        return console.log(`Changed key pair to: ${name}`);
      } catch (err) {
        console.log(`Could not copy, check if you have permission to write on ${SSH_PATH}`);
        return console.error(err);
      }
    } else {
      console.log(`Could not read key pair in ${SSH_PATH+name}`);
      console.log(`Check if key pair exists in ${SSH_PATH+name}\n\n`);
      console.log(`If not you can create a new one with: "sshmulti -n ${name}"`);
      return console.log(`Or backup the current key pair in ${SSH_PATH} with: "sshmulti -b ${name}"`);
    }
  } catch (err) {
    return console.error(err);
  }
}

// Register new ssh key
const newKey = name => {
  if (existsSync(SSH_PATH + name)) {
    return console.log(`${SSH_PATH+name} already exists, skipping`);
  } else {
    console.log(`Creating key pair in ${SSH_PATH+name}`);
    try {
      mkdirSync(SSH_PATH + name);
      const pair = keypair();
      const publicKey = forge.pki.publicKeyFromPem(pair.public);
      const privateKey = forge.pki.privateKeyFromPem(pair.private)
      const ssh = forge.ssh.publicKeyToOpenSSH(publicKey);
      const sshPrivate = forge.ssh.privateKeyToOpenSSH(privateKey);
      writeFileSync(`${SSH_PATH+name}/id_rsa.pub`, ssh);
      writeFileSync(`${SSH_PATH+name}/id_rsa`, sshPrivate);
      chmodSync(`${SSH_PATH+name}/id_rsa.pub`, 0o600);
      chmodSync(`${SSH_PATH+name}/id_rsa`, 0o600);
      return console.log(`\n public key: \n\n ${ssh}\n private key: \n\n ${sshPrivate}`);
    } catch (err) {
      console.log(`Could not create key pair, check if you have permission to write on ${SSH_PATH+name}`);
      return console.log(err);
    }
  }
};

// backup ssh keys
const backupKey = name => {
  if (existsSync(SSH_PATH + name)) {
    return console.log(`${SSH_PATH+name} already exists, skipping`);
  } else {
    console.log(`Copying current key pair in ${SSH_PATH} to ${SSH_PATH+name}`);
    try {
      mkdirSync(SSH_PATH + name);
      copyFileSync(SSH_PATH + "id_rsa", SSH_PATH + name + "/id_rsa");
      copyFileSync(SSH_PATH + "id_rsa.pub", SSH_PATH + name + "/id_rsa.pub");
      return console.log(`Backup to current key pair in ${SSH_PATH} to ${SSH_PATH+name}`)
    } catch (err) {
      console.log(`Could not backup key pair, check if you have permission to write on ${SSH_PATH+name}`);
      return console.log(err);
    }
  }
};

// Rename ssh key
const renameKey = (oldname, newname) => {
  if (existsSync(SSH_PATH + newname)) {
    return console.log(`${SSH_PATH+newname} already exists, cannot rename`);
  } else {
    try {
      renameSync(SSH_PATH + oldname, SSH_PATH + newname);
      if (getCurrent() == oldname) {
        writeFileSync(SWITCH_FILE, name);
      }
      return console.log(`Renamed the current key`);
    } catch (err) {
      console.log(`Could not rename`);
      return console.log(err);
    }
  }
}

// delete ssh key
const deleteKey = name => {
  try {
    rmdir.sync(SSH_PATH + name);
    return console.log(`Deleted ${name} sshkey.`)
  } catch (e) {
    return console.log(e);
  }
}
// Using meow for taking flag and input
const cli = meow(`
Switch and manage key pairs in ${SSH_PATH}

Default usage: sshmulti key_pair_name

Advanced usage: sshmulti [option]
    -c, --current                    Get name of current key pair
    -n, --new                        New key pair name
    -b, --backup                     Backup key pair in ${SSH_PATH}
    -r, --rename                     Rename a key pair
    -l, --list                       Get list of key pairs in ${SSH_PATH}
    -d, --delete DELETE              Delete key pair
`, {
  flags: {
    backup: {
      type: 'boolean',
      alias: 'b',
      default: false
    },
    new: {
      type: 'boolean',
      alias: 'n',
      default: false
    },
    rename: {
      type: 'boolean',
      alias: 'r',
      default: false
    },
    list: {
      type: 'boolean',
      alias: 'l',
      default: false
    },
    current: {
      type: 'boolean',
      alias: 'c',
      default: false
    },
    delete: {
      type: 'boolean',
      alias: 'd',
      default: false
    }
  }
});
// Let the fun began
const isBackup = cli.flags.backup,
      isCurrent = cli.flags.current,
      isDelete = cli.flags.delete,
      isList = cli.flags.list,
      isRename =cli.flags.rename,
      isNew = cli.flags.new,
      name = cli.input;
switch (true) {
  case isBackup && name.length == 1:
    backupKey(name[0]);
    break;
  case isRename && name.length == 1:
    let names = name[0].split(',');
    if(names[0] && names[1]) {
      renameKey(names[0], names[1]);
    } else {
      console.log(`Please enter valid name. Type sshmulti --help for more.`);
    }
    break;
  case isNew && name.length == 1:
    newKey(name[0]);
    break;
  case isDelete && name.length == 1:
    deleteKey(name[0])
    break;
  case isList:
    getList();
    break;
  case isCurrent || name.length == 0:
    getCurrent();
    break;
  case !isBackup && !isCurrent && !isDelete && !isList && !isRename && !isNew && name.length == 1:
    switchKey(name[0]);
    break;
  case name.length > 1:
    console.log(`Enter sshmulti --help for more command`);
    break;
  default:
    console.log(getCurrent());
    break;
}

module.exports = getDirectories;