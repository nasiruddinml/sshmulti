import { SSH_PATH, switchKey } from '../src/index';
const fs = require('fs');

jest.mock('fs');

describe('Switch ssh keys', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.existsSync.mockClear();
    fs.copyFileSync.mockClear();
    fs.writeFileSync.mockClear();
    fs.chmodSync.mockClear();
  });

  // clear any mock
  afterEach(() => {
    jest.clearAllMocks();
  });


  test('it should be call existsSync, copyFileSync, writeFileSync & chmodSync function', async () => {

    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // Let's call our function
    switchKey('work');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(2);

    // check if the copyFileSync function was called
    expect(fs.copyFileSync).toHaveBeenCalled();
    expect(fs.copyFileSync).toBeCalledTimes(2);

    // check if the writeFileSync function was called
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toBeCalledTimes(1);

    // check if the chmodSync function was called
    expect(fs.chmodSync).toHaveBeenCalled();
    expect(fs.chmodSync).toBeCalledTimes(2);
  })

  test('it should return sshkey name', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(true);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    switchKey('work');

    // check our switch is done and return correct sshkey name
    expect(spy).toBeCalledWith('Changed key pair to: work');
  })

  test('it should return error if name not found', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    switchKey('working');

    // check our console.log is called and return error
    expect(spy).toBeCalledWith(`Could not read key pair in ${SSH_PATH + 'working'}`);
    expect(spy).toBeCalledWith(`Check if key pair exists in ${SSH_PATH + 'working'}\n\n`);
    expect(spy).toBeCalledWith(`If not you can create a new one with: "sshmulti -n working"`);
    expect(spy).toBeCalledWith(`Or backup the current key pair in ${SSH_PATH} with: "sshmulti -b working"`);
    expect(spy).toHaveBeenCalledTimes(4);
  })

  test('it should return error if user have no permission to switch', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true);

    // Let's mock copyFileSync function
    fs.copyFileSync.mockReturnValue(true);

    // Let's mock writeFileSync function
    fs.writeFileSync.mockImplementation(() => {throw 'Permission denied'});

    // Let's mock chmodSync function
    fs.chmodSync.mockReturnValue(false);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's spy on console.error
    const spyError = jest.spyOn(console, 'error');

    // Let's call our function
    switchKey('working');

    // check our console.log is called and return error
    expect(spy).toBeCalledWith(`Could not copy, check if you have permission to write on ${SSH_PATH}`);
    expect(spyError).toBeCalledWith(`Permission denied`);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyError).toHaveBeenCalledTimes(1);
  })

  test('it should return error if existSync return error', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockImplementation(() => {throw 'Exist error'});

    // Let's spy on console.error
    const spyError = jest.spyOn(console, 'error');

    // Let's call our function
    switchKey('working');

    // check our console.error is called and return error
    expect(spyError).toBeCalledWith(`Exist error`);
    expect(spyError).toHaveBeenCalledTimes(1);
  })

});
