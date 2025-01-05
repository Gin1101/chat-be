import { customAlphabet } from 'nanoid'


function alphabetIdGenerator(length = 10) {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', length)
    return nanoid()
}

export {
    alphabetIdGenerator
}