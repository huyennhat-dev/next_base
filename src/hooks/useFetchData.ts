import { useState, useEffect } from "react";
import http from "@/lib/http";
import { handleErrorApi } from "@/lib/error";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Props = {
  method: HttpMethod;
  url: string;
  body?: any;
  options?: Omit<RequestInit, "method" | "body">;
};

const useFetchData = <T>({
  method,
  url,
  body,
  options,
}: Props): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        switch (method) {
          case "GET":
            response = await http.get<T>(url, options);
            break;
          case "POST":
            response = await http.post<T>(url, body, options);
            break;
          case "PUT":
            response = await http.put<T>(url, body, options);
            break;
          case "DELETE":
            response = await http.delete<T>(url, body, options);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        setData(response.payload);
      } catch (err: any) {
        setError(err as Error);
        handleErrorApi({ error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [method, url, body, options]);

  return { data, loading, error };
};

export default useFetchData;
