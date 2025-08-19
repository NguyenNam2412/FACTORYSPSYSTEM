import { createAxiosWithToken } from "@api/axiosWithToken";

const authApi = createAxiosWithToken("http://localhost:5000/login", {
  "Content-Type": "application/json",
});

export const loginRequest = (side, credentials) => {
  return authApi.post(`/${side}`, credentials);
};
