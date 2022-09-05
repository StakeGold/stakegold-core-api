import { PipeTransform } from "@nestjs/common";
export declare class ParseOptionalIntPipe implements PipeTransform<string | undefined, Promise<number | undefined>> {
    transform(value: string | undefined): Promise<number | undefined>;
}
