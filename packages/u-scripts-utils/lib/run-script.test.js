'use strict'

const runScript = require('./run-script')
const run = require('./run')

jest.mock('./run')

/** @type {Object} */
const mockRun = run

describe('run-script', () => {
  it('runs script', async () => {
    mockRun.mockImplementation(() => 0)
    const script = 'webpack'
    const scriptPath = 'path/to/webpack.js'

    const result = await runScript(script, scriptPath)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([scriptPath]),
      expect.any(Object)
    )
  })

  it("returns with script's exit code", async () => {
    mockRun.mockImplementation(() => 2)

    const result = await runScript('prettier', 'a/b/c.js')

    expect(run).toHaveBeenCalled()
    expect(result).toBe(2)
  })

  it('runs script with args', async () => {
    mockRun.mockImplementation(() => 0)
    const script = 'eslint'
    const scriptPath = 'path/to/eslint'
    const args = ['.', '--fix']

    const result = await runScript(script, scriptPath, args)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([scriptPath, ...args]),
      expect.any(Object)
    )
  })

  it('runs script with env', async () => {
    mockRun.mockImplementation(() => 0)
    const script = 'babel'
    const scriptPath = 'a/b/c'
    const args = []
    const options = { env: { BABEL_ENV: 'production' } }

    const result = await runScript(script, scriptPath, args, options)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([scriptPath, ...args]),
      expect.objectContaining({ env: options.env })
    )
  })

  it('runs script with args and env', async () => {
    mockRun.mockImplementation(() => 0)
    const script = 'jest'
    const scriptPath = 'some/path/to/jest'
    const args = ['--ci']
    const options = { env: { BABEL_ENV: 'test', NODE_ENV: 'test' } }

    const result = await runScript(script, scriptPath, args, options)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([scriptPath, ...args]),
      expect.objectContaining({ env: options.env })
    )
  })

  it("doesn't run invalid script", async () => {
    mockRun.mockImplementation(() => 0)

    const result = await runScript('foo')

    expect(run).not.toHaveBeenCalled()
    expect(result).toBe(1)
  })
})
