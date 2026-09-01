export const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return value.includes(',') ? Number(digits) / 100 : Number(digits);
}

export function formatCurrencyInput(value: string) {
  return money.format(parseCurrencyInput(value));
}
