import { getList } from '../src/index';
const fs = require('fs');

jest.mock('fs');

describe('get list of ssh keys', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.readdirSync.mockClear();
  });

  // clear any mock
  afterEach(() => {
    jest.clearAllMocks();
  });


  test('it should be call readdirSync function', async () => {
    // Let's call our function
    const result = await getList();

    // check if the readdirSync function was called
    expect(fs.readdirSync).toHaveBeenCalled();
  })

  test('it should be return list of sshkey name', async () => {
    // set some return data to be used in your implementation
    fs.readdirSync.mockReturnValue([{name: 'work', isDirectory: () => true}, {name: 'personal', isDirectory: () => true}, {name: 'bob', isDirectory: () => false}])
    // Let's call our function
    const result = await getList();
    // check our result is what we expect from .ssh directory
    expect(result).toEqual(['work', 'personal']);
    // check if the readdirSync function was called return correct data
    expect(result?.length).toBe(2);
  })

});
