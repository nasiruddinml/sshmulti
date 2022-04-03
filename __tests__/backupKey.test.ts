import { SSH_PATH, backupKey } from '../src/index';
const fs = require('fs');

jest.mock('fs');

describe('Backup ssh keys', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.existsSync.mockClear();
    fs.mkdirSync.mockClear();
    fs.copyFileSync.mockClear();
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
    backupKey('working');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(1);

    // check return console.log
    expect(spy).toHaveBeenCalledWith(`${SSH_PATH + 'working'} already exists, skipping`);
  })

  test('it should be call existsSync, mkdirSync & copyFileSync function', async () => {

    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's call our function
    backupKey('working');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(1);

    // check if the mkdirSync function was called
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toBeCalledTimes(1);

    // check if the copyFileSync function was called
    expect(fs.copyFileSync).toHaveBeenCalled();
    expect(fs.copyFileSync).toBeCalledTimes(2);

  })

  test( 'It should start with copying current key pair', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    backupKey('working');

    // check it's print create new ssh key
    expect(console.log).toHaveBeenCalledWith(`Copying current key pair in ${SSH_PATH} to ${SSH_PATH + 'working'}`);
  })
  test('it should backup sshkey', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    backupKey('working');

    // check our switch is done and return correct sshkey name
    expect(spy).toBeCalledWith(`Backup to current key pair in ${SSH_PATH} to ${SSH_PATH + 'working'}`);
  })


  test('it should return error if user have no permission to backup', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's mock mkdirSync function
    fs.mkdirSync.mockImplementation(() => {throw 'Permission denied'});

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(false);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    backupKey('working');

    // check our console.log is called and return error
    expect(spy).toBeCalledWith( `Could not backup key pair, check if you have permission to write on ${
      SSH_PATH + 'working'
    }`);
    expect(spy).toBeCalledWith(`Permission denied`);
    expect(spy).toHaveBeenCalledTimes(3);
  })

});
