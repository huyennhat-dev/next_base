import envConfig from "@/configs/env";
import { EntityError, HttpError } from "@/lib/error";
import { ApiResponse } from "@/lib/type";
import {
  HTTP_STATUS_UNPROCESSABLE_ENTITY,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/lib/status-code";
import { EntityErrorPayload } from "@/lib/type";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schema/auth";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

class AccessToken {
  private token = "";
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
}

export const clientAccessToken = new AccessToken();

let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization:
      clientAccessToken.value && `Bearer ${clientAccessToken.value}`,
  };
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined ? envConfig.API_URL : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  // Interceptor
  if (!res.ok) {
    if (res.status === HTTP_STATUS_UNPROCESSABLE_ENTITY) {
      throw new EntityError(
        data as {
          status: typeof HTTP_STATUS_UNPROCESSABLE_ENTITY;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === HTTP_STATUS_UNAUTHORIZED) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
         //handle logout, get new access token ...
          clientAccessToken.value = "";
          location.href = "/login";
        }
      }
    } else {
      throw new HttpError(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientAccessToken.value = (
        payload as ApiResponse<LoginResType>
      ).data!.accessToken;
    } else if ("auth/logout" === normalizePath(url)) {
      clientAccessToken.value = "";
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
