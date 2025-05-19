const PUBLIC_API_HOST = process.env.PUBLIC_API_HOST;

export const getSubscriptionConfirmationUrl = (
  token: string,
) => `${PUBLIC_API_HOST}/api/confirm/${token}`;

export const getUnsubscriptionUrl = (token: string) =>
  `${PUBLIC_API_HOST}/api/unsubscribe/${token}`;
