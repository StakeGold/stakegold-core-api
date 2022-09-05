import { PipeTransform } from "@nestjs/common";
export declare class ParseOptionalEnumPipe<T extends {
    [name: string]: unknown;
}> implements PipeTransform<string | undefined, Promise<string | undefined>> {
    private readonly type;
    constructor(type: T);
    transform(value: string | undefined): Promise<string | undefined>;
    private getValues;
}
