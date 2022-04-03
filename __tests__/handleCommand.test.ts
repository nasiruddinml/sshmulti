import * as cliModule from '../src/index'
import { handleCommand } from '../src/index'

const mockArgv = {
  _: [],
  c: false,
  current: false,
  backup: false,
  b: false,
  new: false,
  n: false,
  rename: false,
  r: false,
  list: false,
  l: false,
  delete: false,
  d: false,
  '$0': '../src/index'
}

describe('Checking handleCommand functions', () => {
  // Get ready before original test
  let originalArgv: string[]
  let createCliApp: any
  let mockArgv: any

  beforeEach(() => {
    // Remove cached modules. This is needed to run the ../cli.js script
    // multiple times with different arguments.
    jest.resetModules()

    // jest.mock("../src/index");
    // createCliApp = require("../src/index");

    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv

    // Set arguments back to the original value
    mockArgv = {
      _: [],
      c: false,
      current: false,
      backup: false,
      b: false,
      new: false,
      n: false,
      rename: false,
      r: false,
      list: false,
      l: false,
      delete: false,
      d: false,
      '$0': '../src/index'
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()

    // Set process arguments back to the original value
    process.argv = originalArgv
  })

  it('sshmulti command test without any options', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockGetCurrent = jest.spyOn(cliModule, 'getCurrent').mockReturnValue('current')

    mockArgv._ = []
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockGetCurrent).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('current')
  })

  it('sshmulti command test with -c options', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockGetCurrent = jest.spyOn(cliModule, 'getCurrent').mockReturnValue('current')

    mockArgv.current = true
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockGetCurrent).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('current')
  })

  it('sshmulti command test with -b options', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockBackup = jest.spyOn(cliModule, 'backupKey').mockImplementation(() => {
      return console.log(`Backing up done`)
    })

    mockArgv.backup = true
    mockArgv._ = ['working']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockBackup).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Backing up done')
  })

  it('sshmulti command test with -b options without key name', async () => {
    // Let's set mock data to be used in our implementation
    const mockBackup = jest.spyOn(cliModule, 'backupKey')

    mockArgv.backup = true
    mockArgv._ = ['']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockBackup).toBeCalledTimes(0)
  })

  it('sshmulti command test with -n options', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockNewKey = jest.spyOn(cliModule, 'newKey').mockImplementation(() => {
      return console.log(`New key created`)
    })

    mockArgv.new = true
    mockArgv._ = ['working']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockNewKey).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('New key created')
  })

  it('sshmulti command test with -r options', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockRenameKey = jest.spyOn(cliModule, 'renameKey').mockImplementation(() => {
      return console.log(`Renamed key done`)
    })

    mockArgv.rename = true
    mockArgv._ = ['working', 'new']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockRenameKey).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Renamed key done')
  })

  it('sshmulti command test with -l options', async () => {
    // Let's set mock data to be used in our implementation
    const mockListKey = jest.spyOn(cliModule, 'getList').mockImplementation(() => {
      return ['working', 'new']
    })

    mockArgv.list = true
    mockArgv._ = []
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockListKey).toHaveBeenCalled()
  })

  it('sshmulti command test with -d options', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockDeleteKey = jest.spyOn(cliModule, 'deleteKey').mockImplementation(() => {
      return console.log(`Delete key done`)
    })

    mockArgv.delete = true
    mockArgv._ = ['working']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockDeleteKey).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Delete key done')
  })

  it('sshmulti command test with switch key', async () => {
    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    // Let's set mock data to be used in our implementation
    const mockSwitchKey = jest.spyOn(cliModule, 'switchKey').mockImplementation(() => {
      return console.log(`Switch key done`)
    })

    mockArgv._ = ['working']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(mockSwitchKey).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Switch key done')
  })

  it('sshmulti wrong command test', async () => {

    // Let's spy on console.log function
    const consoleSpy = jest.spyOn(console, 'log')

    mockArgv._ = ['fsdflsa', 'lskfdjlds']
    // Let's call our function
    handleCommand(mockArgv)

    // Let's check if the args and getCurrent function was called
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith('Please enter valid name. Type sshmulti --help for more.')
  })


})
