import axios, { AxiosRequestConfig, AxiosError } from "axios";

export type APIError = AxiosError<{ error: string }>;

class AxiosSingleton {
  private static instance: AxiosSingleton;
  private axios = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  public static getInstance(): AxiosSingleton {
    if (!AxiosSingleton.instance) {
      AxiosSingleton.instance = new AxiosSingleton();
    }
    return AxiosSingleton.instance;
  }

  public async request(config: AxiosRequestConfig) {
    return this.axios.request(config);
  }
}

export default AxiosSingleton.getInstance();
