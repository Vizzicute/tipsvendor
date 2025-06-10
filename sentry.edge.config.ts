import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c1614c32207e99e122e97a1e7abd7d3c@o4508534151708672.ingest.us.sentry.io/4509453600161792",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
