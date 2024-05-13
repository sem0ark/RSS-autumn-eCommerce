export const nameValidators = [
  (text: string) =>
    /^[a-z][a-z ,.'-]*$/i.test(text)
      ? false
      : 'Must contain at least one character and no special characters or numbers',
];

export const dateOfBirthValidators = [
  (text: string) =>
    Number.isNaN(Date.parse(text)) ? 'Please, provide a correct date' : false,
  (text: string) => {
    const ageDifMs = Date.now() - Date.parse(text);
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 13
      ? false
      : 'User must be at least 13 years old';
  },
];

export const emailValidators = [
  (text: string) =>
    /^[A-Za-z0-9\-\@\.]+$/.test(text)
      ? false
      : 'Email must only contain letters (a-z), digits & symbols (@-.).',

  // Email address must not contain leading or trailing whitespace.
  (text: string) =>
    text.startsWith(' ') || text.endsWith(' ')
      ? 'Email must not contain leading/trailing whitespace'
      : false,
  // Email address must be properly formatted (e.g., user@example.com).
  (text: string) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(text)
      ? false
      : 'Email address must be properly formatted (e.g., user@example.com)',
];

export const passwordValidators = [
  // Password must be at least 8 characters long.
  (text: string) =>
    text.length < 8 ? 'Password must be at least 8 characters long.' : false,
  // Password must contain at least one uppercase letter (A-Z).
  (text: string) =>
    /[A-Z]/g.test(text)
      ? false
      : 'Password must contain at least one uppercase letter (A-Z).',
  // Password must contain at least one lowercase letter (a-z).
  (text: string) =>
    !/[a-z]/g.test(text) &&
    'Password must contain at least one lowercase letter (a-z).',
  // Password must contain at least one digit (0-9).
  (text: string) =>
    !/[0-9]/g.test(text) && 'Password must contain at least one digit (0-9).',
  // (Optional) Password must contain at least one special character (e.g., !@#$%^&*).
  // TODO: add later for debugging and testing simplicity
  // Password must not contain leading or trailing whitespace.
  (text: string) =>
    (text.startsWith(' ') || text.endsWith(' ')) &&
    'Password must not contain leading or trailing whitespace.',

  (text: string) =>
    /^[A-Za-z0-9\!\@\#\$\%\^\&\*]+$/.test(text)
      ? false
      : 'Password must only contain letters (a-z), digits and symbols (!@#$%^&*).',
];
