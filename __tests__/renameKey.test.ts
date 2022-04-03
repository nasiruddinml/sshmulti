import { SSH_PATH, renameKey } from '../src/index';
const fs = require('fs');

jest.mock('fs');

describe('Backup ssh keys', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.existsSync.mockClear();
    fs.renameSync.mockClear();
    fs.writeFileSync.mockClear();
  });

  // clear any mock
  afterEach(() => {
    jest.clearAllMocks();
  });

  test( 'It should return, if old ssh key not exists', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    renameKey('old', 'new');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(1);

    // check return console.log
    expect(spy).toHaveBeenCalledWith(`${SSH_PATH + 'old'} doesn't exists, cannot rename`);
  })
  test( 'It should return, if new ssh key already exists', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true);

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    renameKey('old', 'new');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(2);

    // check return console.log
    expect(spy).toHaveBeenCalledWith(`${SSH_PATH + 'new'} already exists, cannot rename`);
  })

  test('it should be call existsSync, renameSync, readFileSync & writeFileSync function', async () => {

    // Let's mock existsSync function
    fs.existsSync.mockImplementation((path: string) => path.includes('/.ssh/old'))

    // Let's mock renameSync function
    fs.renameSync.mockReturnValue(true);

    // Let's mock readFileSync function
    fs.readFileSync.mockImplementation((path: string) => {
      if (path.includes('/.ssh/.sshwitch')) {
        return 'old';
      }
    })

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's call our function
    renameKey('old', 'new');

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.existsSync).toBeCalledTimes(3);

    // check if the renameSync function was called
    expect(fs.renameSync).toHaveBeenCalled();
    expect(fs.renameSync).toBeCalledTimes(1);

    // check if the readFileSync function was called
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.readFileSync).toBeCalledTimes(1);

    // check if the writeFileSync function was called
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toBeCalledTimes(1);
  })

  test( 'It should print renamed after successfully renamed', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockImplementation((path: string) => path.includes('/.ssh/old'))

    // Let's mock renameSync function
    fs.renameSync.mockReturnValue(true);

    // Let's mock readFileSync function
    fs.readFileSync.mockImplementation((path: string) => {
      if (path.includes('/.ssh/.sshwitch')) {
        return 'old';
      }
    })

    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);

    // Let's call our function
    renameKey('old', 'new');

    // check it's print create new ssh key
    expect(console.log).toHaveBeenCalledWith(`Renamed old key to new`);
  })

  test( 'It should return error if rename failed', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockImplementation((path: string) => path.includes('/.ssh/old'))

    // Let's mock renameSync function
    fs.renameSync.mockImplementation(() => {throw 'Permission denied'});

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log');

    // Let's call our function
    renameKey('old', 'new');

    // check it's print error
    expect(console.log).toHaveBeenCalledWith('Could not rename key pair');
    expect(spy).toHaveBeenCalledWith('Permission denied');
    expect(spy).toHaveBeenCalledTimes(2);
  })
});
