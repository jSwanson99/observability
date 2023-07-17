import axios from "axios";
import { RandomIdGenerator } from '@opentelemetry/sdk-trace-base';
import { createContext } from "react";

const ridGen = new RandomIdGenerator();

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
})

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers['x-b3-trace-id'] = ridGen.generateTraceId();
        config.headers['x-b3-span-id'] = ridGen.generateSpanId();
        return config;
    },
    (error) => {
        console.error(error);
    },
)

export default axiosInstance;

export const AxiosContext = createContext(axiosInstance);
