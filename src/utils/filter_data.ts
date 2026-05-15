const filterData = <
    T extends {
        createdAt?: unknown;
        updatedAt?: unknown;
        isActive?: unknown;
    }
>(
    obj: T,
    fields: (keyof Omit<T, "createdAt" | "updatedAt" | "isActive">)[] = []
) => {
    const {
        createdAt,
        updatedAt,
        isActive,
        ...rest
    } = obj;

    fields.forEach((field) => {
        delete rest[field];
    });

    return rest;
};

export default filterData;