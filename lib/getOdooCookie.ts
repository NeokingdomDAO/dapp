import Boom from "@hapi/boom";

export async function getOdooCookie(username: string, password: string) {
  // Get CSRF Token and Cookie
  const csrfResponse = await fetch(process.env.ODOO_WEB_LOGIN_ENDPOINT, {
    credentials: "omit",
    referrer: `${process.env.NEXT_PUBLIC_ODOO_ENDPOINT}/web`,
  });

  const csrfCookie = csrfResponse.headers.get("Set-Cookie");
  if (!csrfCookie) {
    throw Boom.expectationFailed("Cannot get cookie");
  }

  const body = await csrfResponse.text();
  const match = body.match(/\s+csrf_token:\s+"([^"]+)"/);
  if (!match || !match[1]) {
    throw Boom.expectationFailed("Cannot get CSRF token");
  }
  const csrfToken = match[1];

  // Login and get Cookie
  const loginResponse = await fetch(process.env.ODOO_WEB_LOGIN_ENDPOINT, {
    method: "POST",
    referrer: process.env.ODOO_WEB_LOGIN_ENDPOINT,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookie,
    },
    redirect: "manual", // Do not follow the redirect, we need to grab that cookie before the 303
    credentials: "include",
    mode: "cors",
    body: new URLSearchParams({
      login: username,
      password,
      csrf_token: csrfToken,
      redirect: "",
    }),
  });

  const cookie = loginResponse.headers.get("Set-Cookie");
  if (!cookie) {
    throw Boom.unauthorized("Cannot get final cookie");
  }
  return cookie;
}
