import { toast } from "sonner";
import { HTTP_STATUS_UNPROCESSABLE_ENTITY } from "@/lib/status-code";
import { EntityErrorPayload } from "@/lib/type";
import { UseFormSetError } from "react-hook-form";
export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof HTTP_STATUS_UNPROCESSABLE_ENTITY;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof HTTP_STATUS_UNPROCESSABLE_ENTITY;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast("Error", {
      duration: duration ?? 5000,
      description: error?.payload?.message ?? "Lỗi không xác định",
    });
  }
};
