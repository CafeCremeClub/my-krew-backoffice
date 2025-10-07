import { AxiosError } from 'axios';

export function handleSignupError(
  error: unknown,
  setError?: (msg: string) => void
): string {
  if (error instanceof AxiosError) {
    if (error.status === 500) {
      if (error.response && error.response.data.name === 'OtpInvalid') {
        const message =
          'Le code de vérification est invalide ou a expiré. Veuillez demander un nouveau code.';
        setError?.(message);
        return message;
      }

      if (error.response && error.response.data.name === 'UserNotFound') {
        const message =
          'Aucun utilisateur trouvé avec cette adresse e-mail. Veuillez vérifier votre adresse e-mail ou vous inscrire.';
        setError?.(message);
        return message;
      }

      const message = 'Adresse e-mail incorrect.';
      setError?.(message);
      return message;
    }

    const message =
      "Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.";
    setError?.(message);
    return message;
  }

  const message =
    "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.";
  setError?.(message);
  return message;
}
