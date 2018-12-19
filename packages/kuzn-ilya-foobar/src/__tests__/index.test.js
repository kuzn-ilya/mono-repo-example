import { foobar } from '..'
import { flushPromises } from './utils'

describe('foobar', () => {
  it('should return message', async done => {
    const result = foobar('Ilya')
    flushPromises()

    result.then(r => {
      expect(r).toBe('Hello, Ilya, from foo!!!')
      done()
    })
  })
})
