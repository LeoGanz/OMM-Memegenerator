export const getJwt = (jwt: string): string => "?token=" + jwt
export const objectToQuery = (obj: { [x: string]: string | number }): string => {
    let str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return "&" + str.join("&");
}