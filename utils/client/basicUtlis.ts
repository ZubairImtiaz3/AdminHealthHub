export const mergeAndRemoveDuplicates = <T extends Record<string, any>>(arr1: T[], arr2: T[], uniqueKey: keyof T): T[] => {
    const map = new Map<string, T>();
    arr1.forEach(item => map.set(item[uniqueKey] as string, item));
    arr2.forEach(item => map.set(item[uniqueKey] as string, item));

    return Array.from(map.values());
};