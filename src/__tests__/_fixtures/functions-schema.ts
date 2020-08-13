import { $, createFunctionsSchema, functionInterface } from '../..'

const callable = {
  createUser: functionInterface.callable(
    $.Record({
      name: $.String,
      displayName: $.Union($.String, $.Null),
      age: $.Number,
      tags: $.Array($.String),
      options: $.Record({
        a: $.Boolean,
        b: $.String,
      }),
    }).And(
      $.Record({
        timestamp: $.String,
      }),
    ),

    $.Record({
      result: $.Number,
    }),
  ),
}

const http = {
  getKeys: functionInterface.http(),
}

const topic = {
  publishMessage: functionInterface.topic(
    $.Record({
      text: $.String,
    }),
  ),
}

const schedule = {
  cron: functionInterface.schedule(),
}

export const functionsSchema = createFunctionsSchema({
  callable,
  http,
  topic,
  schedule,
})
