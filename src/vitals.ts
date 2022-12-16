const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

const getConnectionSpeed = (): any =>
  'connection' in navigator &&
  navigator.connection !== undefined &&
  // @ts-expect-error
  'effectiveType' in navigator.connection
    ? navigator.connection.effectiveType
    : '';

export const sendToVercelAnalytics = (metric: any): void => {
  const analyticsId = process.env.REACT_APP_VERCEL_ANALYTICS_ID;
  if (analyticsId === null || analyticsId === undefined) {
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: 'application/x-www-form-urlencoded',
  });

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else
    void fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
};
