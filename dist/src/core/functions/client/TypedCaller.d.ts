import { _fweb } from '../../../lib/functions-types.js';
import { ExtractFP } from '../../types/_functions.js';
import { FunTypes } from '../../types/index.js';
export declare class TypedCaller<M extends FunTypes.FunctionsModule> {
    readonly functionsApp: _fweb.Functions;
    constructor(functionsApp: _fweb.Functions);
    call<MC extends M['callable'], FP extends ExtractFP<MC>>(functionPath: FP, data: FunTypes.Callable.InputOf<MC, FP>, options?: _fweb.HttpsCallableOptions): Promise<FunTypes.Callable.CallResult<FunTypes.Callable.OutputOf<MC, FP>>>;
}
