import type {Handler} from "aws-lambda";
import {initResources} from "../../businessLogic/init";

export const handler: Handler<any, void> = async event => {
  console.log('Processing event', JSON.stringify(event))
  await initResources()
}
