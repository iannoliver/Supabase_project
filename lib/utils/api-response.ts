import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, message?: string, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
    },
    init,
  );
}

export function apiError(message: string, error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    {
      status,
    },
  );
}
