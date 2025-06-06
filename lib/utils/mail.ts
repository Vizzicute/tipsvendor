interface MailOptions {
  to: string;
  subject: string;
  html?: string;
  predictions?: any[];
  subscriptionType?: string;
}

export async function sendMail({ to, subject, html, predictions, subscriptionType }: MailOptions) {
  // Only include defined fields
  const body: any = { to, subject };
  if (html) body.html = html;
  if (predictions) body.predictions = predictions;
  if (subscriptionType) body.subscriptionType = subscriptionType;

  const response = await fetch('/api/mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send email');
  }

  return response.json();
}

export async function sendBulkMail(
  recipients: string[],
  subject: string,
  html: string,
  predictions?: any[],
  subscriptionType?: string
) {
  const promises = recipients.map(to =>
    sendMail({ to, subject, html, predictions, subscriptionType })
  );
  return Promise.all(promises);
}