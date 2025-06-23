import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c1614c32207e99e122e97a1e7abd7d3c@o4508534151708672.ingest.us.sentry.io/4509453600161792",

  integrations: [
    Sentry.replayIntegration(),
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});