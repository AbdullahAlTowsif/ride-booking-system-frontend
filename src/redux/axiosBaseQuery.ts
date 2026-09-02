import { axiosInstance } from "@/lib/axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

type AxiosQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs, unknown, unknown> =>
  async (args, { signal }) => {
    const { url, method, data, params, headers } = args;
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
        signal,
      });
      return { data: result.data };
    } catch (axiosError) {
      if (axios.isCancel(axiosError)) {
        return { error: { status: "CANCELLED", data: undefined } };
      }
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
