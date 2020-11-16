export const withType = <T>() => <U>(value: U) => value as U & T
