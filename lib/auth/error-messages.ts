export function getAuthErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "E-mail ou senha invalidos.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Seu e-mail ainda nao foi confirmado.";
  }

  if (normalizedMessage.includes("too many requests")) {
    return "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.";
  }

  if (normalizedMessage.includes("network") || normalizedMessage.includes("fetch")) {
    return "Nao foi possivel conectar ao servidor de autenticacao.";
  }

  return "Nao foi possivel concluir a autenticacao.";
}
