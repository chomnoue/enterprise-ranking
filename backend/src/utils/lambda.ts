import middy from "@middy/core"
import errorLogger from '@middy/error-logger'
import middyJsonBodyParser from "@middy/http-json-body-parser"
import inputOutputLogger from '@middy/input-output-logger'

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(errorLogger()).use(inputOutputLogger())
}
