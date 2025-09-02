import {AxiosError} from "axios";


export function handleOtpError(error: unknown, setError?: (msg: string) => void): string {
    if (error instanceof AxiosError) {
        if (error.status === 500) {
            if (error.response && error.response.data.name === "UserNotFound") {
                const message = "Aucun utilisateur trouvé avec cette adresse e-mail. Veuillez vérifier votre adresse e-mail ou vous inscrire.";
                setError?.(message);
                return message;
            }

            const message = "Une erreur s'est produite lors de l'envoi du code de vérification. Veuillez réessayer plus tard.";
            setError?.(message);
            return message;
        }

        const message = "Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.";
        setError?.(message);
        return message;
    }

    const message = "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.";
    setError?.(message);
    return message;
}