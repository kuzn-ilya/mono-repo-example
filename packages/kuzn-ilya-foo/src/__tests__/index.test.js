import { foo } from '../index'

describe('foo', () => {
  it('should return message', () => {
    const result = foo('Ilya')
    expect(result).toBe('Hello, Ilya, from foo!')
  })
})
