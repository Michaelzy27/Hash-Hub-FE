import { API_BASE_URL } from "./api";
import { toast } from "sonner";

/**
 * Wrapper around fetch that auto-logs out on 401 responses.
 * Usage is identical to fetch() but prepends API_BASE_URL to the path.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${path}`, options);

  if (res.status === 401) {
    // Clear auth state
    localStorage.removeItem("auth_token");
    localStorage.removeItem("profile_complete");
    localStorage.removeItem("user_profile");

    toast.error("Session expired. Please log in again.");

    // Redirect to login
    window.location.href = "/login";

    // Return the response but callers won't typically reach past this
    return res;
  }

  return res;
}
