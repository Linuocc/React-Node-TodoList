import axios from "axios";
import configs from "../config/config";

/**
 * 封装网络请求
 * @param config
 * @returns {AxiosPromise}
 */
export function request(config) {
  const instance = axios.create(configs.apiConfig);
  
  return instance(config);
}
