/**
 * Fills missing months in referral stats data with amount = 0
 * Ensures all months from (current month of previous year) to (current month of current year) are present
 */
export const fillMissingMonths = (
  months: Array<{ month: string; amount: number }>
) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-based (0 = January, 11 = December)

  // Create array of all required months
  const allMonths: Array<{ month: string; amount: number }> = [];

  // Add months from previous year (from current month to December)
  for (let month = currentMonth; month <= 11; month++) {
    const monthString = `${currentYear - 1}-${String(month + 1).padStart(
      2,
      '0'
    )}`;
    allMonths.push({ month: monthString, amount: 0 });
  }

  // Add months from current year (from January to current month)
  for (let month = 0; month <= currentMonth; month++) {
    const monthString = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
    allMonths.push({ month: monthString, amount: 0 });
  }

  // Create a map of existing data for quick lookup
  const existingData = new Map<string, number>();
  months.forEach((item) => {
    existingData.set(item.month, item.amount);
  });

  // Fill in actual amounts where data exists
  const filledMonths = allMonths.map((monthItem) => ({
    month: monthItem.month,
    amount: existingData.get(monthItem.month) || 0,
  }));

  return filledMonths;
};
