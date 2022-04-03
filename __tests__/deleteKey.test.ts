import { SSH_PATH, deleteKey } from '../src/index'
const fs = require('fs')
import * as rmdir from 'rimraf'

jest.mock('fs')
jest.mock('rimraf')

describe('Backup ssh keys', () => {
  // Get ready before original test
  beforeEach(() => {
    // clear any previous calls
    fs.existsSync.mockClear()
  })

  // clear any mock
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('It should return, if ssh key not exists', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(false)

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log')

    // Let's call our function
    deleteKey('working')

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled()
    expect(fs.existsSync).toBeCalledTimes(1)

    // check return console.log
    expect(spy).toHaveBeenCalledWith(
      `${SSH_PATH + 'working'} doesn't exists, cannot delete`
    )
  })

  test('it should be call existsSync, rmdirSync function', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true)

    // Let's mock rmdirSync function
    jest.mock('rimraf', () => {
      return {
        sync: jest.fn().mockReturnValue(true),
      }
    })

    // Let's spy on rmdirSync function
    const spy = jest.spyOn(rmdir, 'sync')

    // Let's call our function
    deleteKey('working')

    // check if the existsSync function was called
    expect(fs.existsSync).toHaveBeenCalled()
    expect(fs.existsSync).toBeCalledTimes(1)

    // check if the rmdirSync function was called
    expect(spy).toHaveBeenCalled()
    expect(spy).toBeCalledTimes(1)
  })
  test('it should be print success message', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true)

    // Let's mock rmdirSync function
    jest.mock('rimraf', () => {
      return {
        sync: jest.fn().mockReturnValue(true),
      }
    })

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log')

    // Let's call our function
    deleteKey('working')

    // Check this print success message
    expect(spy).toHaveBeenCalledWith(`Deleted working sshkey.`)
  })
  test('it should be print error message', async () => {
    // Let's mock existsSync function
    fs.existsSync.mockReturnValue(true)

    // Let's mock rmdirSync function
    jest.spyOn(rmdir, 'sync').mockImplementation(() => {throw 'Permission denied'})

    // Let's spy on console.log
    const spy = jest.spyOn(console, 'log')

    // Let's call our function
    deleteKey('working')

    // Check this print success message
    expect(spy).toHaveBeenCalledWith('Permission denied')
  })
})
