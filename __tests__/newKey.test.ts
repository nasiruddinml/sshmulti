import { SSH_PATH, newKey } from '../src/index';
const fs = require('fs');
const forge = require('node-forge');

jest.mock('fs');

describe('New ssh keys', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.existsSync.mockClear();
    fs.copyFileSync.mockClear();
    fs.mkdirSync.mockClear();
    fs.writeFileSync.mockClear();
    fs.chmodSync.mockClear();
  });

  // clear any mock
  afterEach(() => {
    jest.clearAllMocks();
  });

  test( 'It should return, if ssh key already exists', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    newKey('working');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(1);

    // check return console.log
    expect(spy).toHaveBeenCalledWith(`${SSH_PATH + 'working'} already exists, skipping`);
  })


  test('it should be call existsSync, mkdirSync, copyFileSync, writeFileSync & chmodSync function', async () => {

    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // Let's call our function
    newKey('working');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(1);

    // check if the mkdirSync function was called
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toBeCalledTimes(1);

    // check if the copyFileSync function was called
    expect(fs.copyFileSync).toHaveBeenCalled();
    expect(fs.copyFileSync).toBeCalledTimes(2);

    // check if the writeFileSync function was called
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toBeCalledTimes(3);

    // check if the chmodSync function was called
    expect(fs.chmodSync).toHaveBeenCalled();
    expect(fs.chmodSync).toBeCalledTimes(2);
  })

  test( 'It should start with creating new ssh key', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    newKey('working');

    // check it's print create new ssh key
    expect(console.log).toHaveBeenCalledWith(`Creating key pair in ${SSH_PATH + 'working'}`);
  })

  test('it should call publicKeyFromPem, privateKeyFromPem, publicKeyToOpenSSH, privateKeyToOpenSSH', async () => {

    jest.mock('node-forge');
    jest.mock('keypair');

    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // Let's spy on publicKeyFromPem
    const publicKeyFromPem = jest.spyOn(forge.pki, 'publicKeyFromPem');

    // Let's spy on privateKeyFromPem
    const privateKeyFromPem = jest.spyOn(forge.pki, 'privateKeyFromPem');

    // Let's spy on publicKeyToOpenSSH
    const publicKeyToOpenSSH = jest.spyOn(forge.ssh, 'publicKeyToOpenSSH');

    // Let's spy on privateKeyToOpenSSH
    const privateKeyToOpenSSH = jest.spyOn(forge.ssh, 'privateKeyToOpenSSH');

    // Let's call our function
    newKey('working');

    // check all function was called
    expect(publicKeyFromPem).toHaveBeenCalled();
    expect(privateKeyFromPem).toHaveBeenCalled();
    expect(publicKeyToOpenSSH).toHaveBeenCalled();
    expect(privateKeyToOpenSSH).toHaveBeenCalled();

    forge.pki.publicKeyFromPem.mockClear();
    forge.pki.privateKeyFromPem.mockClear();
    forge.ssh.publicKeyToOpenSSH.mockClear();
    forge.ssh.privateKeyToOpenSSH.mockClear();
  })
  test('it should print public & private key', async () => {

    jest.mock('node-forge');
    jest.mock('keypair');

    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // Let's spy on publicKeyFromPem
    const publicKeyFromPem = jest.spyOn(forge.pki, 'publicKeyFromPem');

    // Let's spy on privateKeyFromPem
    const privateKeyFromPem = jest.spyOn(forge.pki, 'privateKeyFromPem');

    // Let's spy on publicKeyToOpenSSH
    const publicKeyToOpenSSH = jest.spyOn(forge.ssh, 'publicKeyToOpenSSH').mockReturnValue('publicKeyToOpenSSH');

    // Let's spy on privateKeyToOpenSSH
    const privateKeyToOpenSSH = jest.spyOn(forge.ssh, 'privateKeyToOpenSSH').mockReturnValue('privateKeyToOpenSSH');

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    newKey('working');

    // check public & private key was printed
    expect(console.log).toHaveBeenCalledWith(`\n public key: \n\n publicKeyToOpenSSH\n private key: \n\n privateKeyToOpenSSH`);

    forge.pki.publicKeyFromPem.mockClear();
    forge.pki.privateKeyFromPem.mockClear();
    forge.ssh.publicKeyToOpenSSH.mockClear();
    forge.ssh.privateKeyToOpenSSH.mockClear();
  })

  test('it should return error if error happened', async () => {
    jest.mock('node-forge');
    jest.mock('keypair');

    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockImplementation(() => {throw 'error'});

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // Let's spy on publicKeyFromPem
    const publicKeyFromPem = jest.spyOn(forge.pki, 'publicKeyFromPem');

    // Let's spy on privateKeyFromPem
    const privateKeyFromPem = jest.spyOn(forge.pki, 'privateKeyFromPem');

    // Let's spy on publicKeyToOpenSSH
    const publicKeyToOpenSSH = jest.spyOn(forge.ssh, 'publicKeyToOpenSSH')

    // Let's spy on privateKeyToOpenSSH
    const privateKeyToOpenSSH = jest.spyOn(forge.ssh, 'privateKeyToOpenSSH')
    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    newKey('working');

    // check error was printed
    expect(console.log).toHaveBeenCalledWith(`Could not create key pair, check if you have permission to write on ${
      SSH_PATH + 'working'
    }`);
    expect(console.log).toHaveBeenCalledWith('error');

    forge.pki.publicKeyFromPem.mockClear();
    forge.pki.privateKeyFromPem.mockClear();
    forge.ssh.publicKeyToOpenSSH.mockClear();
    forge.ssh.privateKeyToOpenSSH.mockClear();
  })
})
