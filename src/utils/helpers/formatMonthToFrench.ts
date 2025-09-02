/**
 * Formats a month string (YYYY-MM) to French month name
 * @param monthString - The month string in format "YYYY-MM" (e.g., "2025-08")
 * @returns French month name (e.g., "Août")
 */
export const formatMonthToFrench = (monthString: string): string => {
    try {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);

        return date.toLocaleDateString('fr-FR', { month: 'long' });
    } catch (error) {
        // Return original string if parsing fails
        console.log(error);
        return monthString;
    }
};

