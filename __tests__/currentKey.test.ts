import { getCurrent } from '../src/index';
const fs = require('fs');

jest.mock('fs');

describe('current sshkey is set and viewed', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.writeFileSync.mockClear();
    fs.readFileSync.mockClear();
  });

  // clear any mock
  afterEach(() => {
    jest.clearAllMocks();
  });


  test('it should be return empty if no sshkey name', async () => {
    // Let's mock readFileSync function
    fs.readFileSync.mockImplementationOnce(() => {throw 'Error' })
    fs.readFileSync.mockReturnValue('');
    // Let's mock writeFileSync function
    fs.writeFileSync.mockReturnValue(true);
    // Let's call our function
    const result = getCurrent();

    // check if the writeFileSync function was called due to the empty sshkey name
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    // check our result is that empty string
    expect(result).toBe('');
  })

  test('it should be return current sshkey name', async () => {
    // since we're using fs.readFileSync
    // set some return data to be used in your implementation
    fs.readFileSync.mockImplementation((path: string) => {
      if (path.includes('/.ssh/.sshwitch')) {
        return 'current';
      }
    })
    // Let's call our function
    const result = await getCurrent();
    // check our result is what we expect from sshwhich file
    expect(result).toBe('current');
  })


});
