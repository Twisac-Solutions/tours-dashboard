import { axiosPublic } from "./axios";

export const getFacebookSSOUrl = async (
  callbackUrl: string,
): Promise<string> => {
  const res = await axiosPublic.get<string>("/auth/facebook", {
    params: { callback: callbackUrl },
  });
  return res.data;
};

interface ValidateSSORequest {
  code: string;
  callbackUrl: string;
  provider: "facebook";
}

export const validateFacebookSSOCode = async (
  code: string,
  callbackUrl: string,
): Promise<string> => {
  const payload: ValidateSSORequest = {
    code,
    callbackUrl,
    provider: "facebook",
  };

  const res = await axiosPublic.post("/auth/login/sso", payload);

  // Example: token in response body
  const token = res.data.token;
  return token;
};

export const startSSOLogin = async (
  provider: "google" | "facebook",
  callbackUrl: string,
) => {
  try {
    const res = await axiosPublic.get<string>(`/auth/${provider}`, {
      params: { callback: callbackUrl },
    });

    const redirectUrl = res.data;
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      throw new Error("No redirect URL returned");
    }
  } catch (error) {
    throw error;
  }
};
