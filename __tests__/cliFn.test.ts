import * as cliModule from '../src/index'

jest.mock('fs')

/**
 * Programmatically set arguments and execute the CLI script
 *
 * @param {...string} options - positional and option arguments for the command to run
 */
export const runCommand = (...options: string[]) => {
  process.argv = [
    'node', // Not used but a value is required at this index in the array
    '../src/index', // Not used but a value is required at this index in the array
    ...options, // Any option arguments
  ]

  // Require the yargs CLI script
  return require('../src/index')
}

describe('Checking cli functions', () => {
  // Get ready before original test
  let originalArgv: string[]
  let createCliApp: any

  beforeEach(() => {
    // Remove cached modules. This is needed to run the ../cli.js script
    // multiple times with different arguments.
    jest.resetModules()

    // jest.mock("../src/index");
    // createCliApp = require("../src/index");

    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()

    // Set process arguments back to the original value
    process.argv = originalArgv
  })



  it('sshmulti -c command test', async () => {
    // Let's spy on getCurrent function
    const cliSpy = jest.spyOn(cliModule, 'getCurrent')

    // Let's set mock data to be used in our implementation
    cliSpy.mockReturnValue('current')

    // Let's call our function
    const result = await runCommand('-c')

    // Let's check if the args and getCurrent function was called
    expect(result.parsedArg.current).toBeTruthy()
    expect(result.parsedArg.c).toBeTruthy()
    expect(cliModule.getCurrent()).toEqual('current')

    // restore the original function
    cliSpy.mockRestore()
  })

  it('sshmulti -l command test', async () => {
    // Let's spy on getList function
    const cliSpy = jest.spyOn(cliModule, 'getList')

    // Let's set mock data to be used in our implementation
    cliSpy.mockReturnValue(['work', 'personal'])

    // Let's call our function
    const result = await runCommand('-l')

    // Let's check if the args and getList function was called
    expect(result.parsedArg.list).toBeTruthy()
    expect(result.parsedArg.l).toBeTruthy()
    expect(cliModule.getList()).toEqual(['work', 'personal'])

    // restore the original function
    cliSpy.mockRestore()
  })

  it('sshmulti -b command test', async () => {
    // Let's spy on backupKey function
    const cliSpy = jest.spyOn(cliModule, 'backupKey').mockImplementation()

    // Let's call our function
    const result = await runCommand('-b', 'work')

    // Let's check if the args and getList function was called
    expect(result.parsedArg.backup).toBeTruthy()
    expect(result.parsedArg.b).toBeTruthy()

    // restore the original function
    cliSpy.mockRestore()
  })

  it ('sshmulti -n command test', async () => {
    // Let's spy on backupKey function
    const cliSpy = jest.spyOn(cliModule, 'newKey').mockImplementation()

    // Let's call our function
    const result = await runCommand('-n', 'work')

    // Let's check if the args and getCurrent function was called
    expect(result.parsedArg.new).toBeTruthy()
    expect(result.parsedArg.n).toBeTruthy()

    // restore the original function
    cliSpy.mockRestore()
  })

  it ('sshmulti -r command test', async () => {
    // Let's spy on backupKey function
    const cliSpy = jest.spyOn(cliModule, 'renameKey').mockImplementation()

    // Let's call our function
    const result = await runCommand('-r', 'work', 'work2')

    // Let's check if the args and getCurrent function was called
    expect(result.parsedArg.rename).toBeTruthy()
    expect(result.parsedArg.r).toBeTruthy()

    // restore the original function
    cliSpy.mockRestore()
  })

  it ('sshmulti -d command test', async () => {
    // Let's spy on backupKey function
    const cliSpy = jest.spyOn(cliModule, 'deleteKey').mockImplementation()

    // Let's call our function
    const result = await runCommand('-d', 'work2')

    // Let's check if the args and getCurrent function was called
    expect(result.parsedArg.delete).toBeTruthy()
    expect(result.parsedArg.d).toBeTruthy()

    // restore the original function
    cliSpy.mockRestore()
  })
})
