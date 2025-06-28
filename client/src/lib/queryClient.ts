import { QueryClient, QueryFunction } from "@tanstack/react-query";

// ✅ API base URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * ✅ Throw error with message if response is not OK
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const contentType = res.headers.get("Content-Type");
    let errorMessage;

    try {
      if (contentType?.includes("application/json")) {
        const json = await res.json();
        errorMessage = json.message || JSON.stringify(json);
      } else {
        errorMessage = await res.text();
      }
    } catch {
      errorMessage = res.statusText;
    }

    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

/**
 * ✅ Generic API request with method, URL, optional body
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const fullUrl = `${API_BASE_URL}${url}`;
  console.log(`📡 [apiRequest] ${method} ${fullUrl}`, data || "");

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // ✅ crucial for cookies/JWT
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * ✅ React Query GET function generator with 401 fallback handling
 */
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = `${API_BASE_URL}${queryKey[0] as string}`;
    console.log("🌐 [getQueryFn] GET:", url);

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.warn("⚠️ [getQueryFn] 401 Unauthorized – returning null");
      return null as T;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * ✅ QueryClient default config
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
