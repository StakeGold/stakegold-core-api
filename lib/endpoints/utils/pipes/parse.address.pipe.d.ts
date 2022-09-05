import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class ParseAddressPipe implements PipeTransform<string | undefined, Promise<string | undefined>> {
    transform(value: string | undefined, _: ArgumentMetadata): Promise<string | undefined>;
}
