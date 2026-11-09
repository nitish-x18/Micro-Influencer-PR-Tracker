
const API_BASE_URL = "http://localhost:8000/api/v1";

function getToken() {
  return (
    localStorage.getItem("influenceflow_token") ||
    sessionStorage.getItem("influenceflow_token")
  );
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
      responseData?.data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return responseData;
}

export const api = {
  get: (endpoint) =>
    request(endpoint, { method: "GET" }),

  post: (endpoint, data) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint, data) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (endpoint) =>
    request(endpoint, { method: "DELETE" }),
};
