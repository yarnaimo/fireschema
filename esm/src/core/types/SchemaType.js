import { OK, ZodType } from 'zod'
export class ZodTimestamp extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input)
    return OK(ctx.data)
  }
}
export const timestampType = () => new ZodTimestamp({})
