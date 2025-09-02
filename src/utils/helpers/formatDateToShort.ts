/**
 * Formats a date string to display as "Mer 7:20" format (French)
 * @param dateString - The date string to format
 * @returns Formatted date string in "Mer 7:20" format
 */
export const formatDateToShort = (dateString: string): string => {
    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original string if invalid
        }

        // Get day of week (short form) in French
        const dayOfWeek = date.toLocaleDateString('fr-FR', {weekday: 'short'});

        // Get time in 24-hour format (French style)
        const time = date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // Capitalize first letter of day
        const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

        return `${capitalizedDay} ${time}`;
    } catch (error) {
        console.log(error);
        // Return original string if any error occurs
        return dateString;
    }
};
