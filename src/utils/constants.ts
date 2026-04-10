declare var process: {
  env: {
    BASE_URL?: string;
    SOCKET_URL?: string;
    [key: string]: string | undefined;
  };
};

export const BASE_URL = process.env.BASE_URL || "http://localhost:7777/api";
export const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:7777";
