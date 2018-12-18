import { foobar } from '../index'

// See https://github.com/Microsoft/TypeScript/issues/18523#issuecomment-329979963 for details
type HasType<T, Q extends T> = Q

function testAsyncCall() {
  const result1: Promise<string> = foobar('abc')

  // typings:expect-error
  const result2: Promise<number> = foobar('abc')

  // typings:expect-error
  const result3 = foo(123)
}

