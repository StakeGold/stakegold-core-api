import { Address } from "@elrondnetwork/erdjs/out";
import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from "@nestjs/common";

export class ParseAddressPipe implements PipeTransform<string | undefined, Promise<string | undefined>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string | undefined, _: ArgumentMetadata): Promise<string | undefined> {
    return new Promise(resolve => {
      if (value === undefined || value === '') {
        return resolve(undefined);
      }

      try {
        new Address(value);
        return resolve(value);
      } catch (error) {
        throw new HttpException('Validation failed (a bech32 address is expected)', HttpStatus.BAD_REQUEST);
      }
    });
  }
}
