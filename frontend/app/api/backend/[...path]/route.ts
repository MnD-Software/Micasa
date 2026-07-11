import { NextRequest, NextResponse } from "next/server";

const backendUrl =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

function getTargetUrl(request: NextRequest, path: string[]) {
  if (!backendUrl) {
    return null;
  }

  const base = backendUrl.replace(/\/$/, "");
  const pathname = path.map((part) => encodeURIComponent(part)).join("/");
  const search = request.nextUrl.search;

  return `${base}/${pathname}${search}`;
}

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const targetUrl = getTargetUrl(request, path);

  if (!targetUrl) {
    return NextResponse.json(
      { detail: "Backend API URL is not configured. Set BACKEND_API_URL in Vercel." },
      { status: 503 }
    );
  }

  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
    cache: "no-store"
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json"
    }
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
