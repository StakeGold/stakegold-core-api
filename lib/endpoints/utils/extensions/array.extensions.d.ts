declare interface Array<T> {
    groupBy(predicate: (item: T) => any): any;
    selectMany<TOUT>(predicate: (item: T) => TOUT[]): TOUT[];
    firstOrUndefined(predicate?: (item: T) => boolean): T | undefined;
    zip<TSecond, TResult>(second: TSecond[], predicate: (first: T, second: TSecond) => TResult): TResult[];
    remove(element: T): number;
    findMissingElements<T>(second: T[]): T[];
    distinct(): T[];
    distinctBy<TResult>(predicate: (element: T) => TResult): T[];
    all(predicate: (item: T) => boolean): boolean;
    sorted(predicate?: (element: T) => number): T[];
    sortedDescending(predicate?: (element: T) => number): T[];
    sum(predicate?: (item: T) => number): number;
    sumBigInt(predicate?: (item: T) => bigint): bigint;
    toRecord<TOUT>(keyPredicate: (item: T) => string, valuePredicate?: (item: T) => TOUT): Record<string, TOUT>;
}
