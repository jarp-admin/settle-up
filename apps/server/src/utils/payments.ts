export function generatePaypalLink(
  amount: number,
  currency: string,
  email: string
): string {
  const baseUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=";
  const link = `${baseUrl}${email}&amount=${amount}&currency_code=${currency}&item_name=Payment&no_shipping=1&no_note=1`;
  return link;
}
