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
    getCurrent();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  })

  test('it should be return current sshkey name', async () => {
    // since we're using fs.readFileSync
    // set some return data to be used in your implementation
    fs.readFileSync.mockImplementation((path: string) => {
      if (path.includes('/.ssh/.sshwitch')) {
        return 'current';
      }
    })
    const result = await getCurrent();
    expect(result).toBe('current');
  })


});
