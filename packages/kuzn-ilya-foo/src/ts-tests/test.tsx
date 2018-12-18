import { foo } from '../index'

// See https://github.com/Microsoft/TypeScript/issues/18523#issuecomment-329979963 for details
type HasType<T, Q extends T> = Q

function testAsyncCall() {
  const result1: string = foo('abc')

  // typings:expect-error
  const result2: number = foo('abc')

  // typings:expect-error
  const result3 = foo(123)
}

