// Shared by build-time components and browser scripts.

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export const money = (amount) => gbp.format(amount);
