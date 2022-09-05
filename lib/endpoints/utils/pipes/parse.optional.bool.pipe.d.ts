import { PipeTransform } from "@nestjs/common";
export declare class ParseOptionalBoolPipe implements PipeTransform<string | boolean, Promise<boolean | undefined>> {
    transform(value: string | boolean): Promise<boolean | undefined>;
}
