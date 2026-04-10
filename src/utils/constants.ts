declare var process: any;

export const BASE_URL = (typeof process !== "undefined" && process?.env?.BASE_URL) 
    ? process.env.BASE_URL 
    : "http://localhost:7777/api";

export const SOCKET_URL = (typeof process !== "undefined" && process?.env?.SOCKET_URL) 
    ? process.env.SOCKET_URL 
    : "http://localhost:7777";
