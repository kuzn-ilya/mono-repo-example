import { foo } from 'kuzn-ilya-foo'

export const foobar = arg => Promise.resolve(foo(arg) + '!!')
