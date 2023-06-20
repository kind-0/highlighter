export function dTagFromString(value: string) {
    const randomNumber = Math.floor(Math.random() * 1000000);

    return value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '')
        + '-' + randomNumber;
}