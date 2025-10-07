import { AxiosError } from 'axios';

export function handleCreateConsultantError(
  error: unknown,
  setError?: (msg: string) => void
): string {
  if (error instanceof AxiosError) {
    if (error.status === 500) {
      if (error.response && error.response.data.name === 'UserAlreadyExist') {
        const message =
          'Un consultant avec cette adresse e-mail existe déjà. Veuillez utiliser une autre adresse e-mail.';
        setError?.(message);
        return message;
      }

      const message =
        "Une erreur s'est produite lors de la création du consultant. Veuillez réessayer plus tard.";
      setError?.(message);
      return message;
    }

    const message =
      "Une erreur s'est produite lors de la création du consultant. Veuillez réessayer plus tard.";
    setError?.(message);
    return message;
  }

  const message =
    "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.";
  setError?.(message);
  return message;
}
