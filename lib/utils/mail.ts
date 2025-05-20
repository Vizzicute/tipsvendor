interface MailOptions {
  to: string;
  subject: string;
  html: string;
  predictions?: any[];
  subscriptionType?: string;
}

export async function sendMail({ to, subject, html, predictions, subscriptionType }: MailOptions) {
  const response = await fetch('/api/mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, subject, html, predictions, subscriptionType }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send email');
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