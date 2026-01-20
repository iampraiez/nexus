export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function isValidCompanyName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

export function isValidProjectName(name: string): boolean {
  return name.length >= 1 && name.length <= 100;
}

export function isValidEventName(name: string): boolean {
  return name.length >= 1 && name.length <= 100;
}

export function isValidUserId(userId: string): boolean {
  return userId.length >= 1 && userId.length <= 256;
}
