export const getJwt = (jwt: string): string => "?token=" + jwt
export const objectToQuery = (obj: { [x: string]: string | number | null}): string => {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            if(obj[p] === null) continue;
            // @ts-ignore
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return "&" + str.join("&");
}