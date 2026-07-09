const { isIneFormatValid, normalizeIne } = require('../src/utils/ine');

describe('utils/ine — validation du format INE', () => {
  it('accepte un format valide (9 chiffres + alphanumérique + lettre)', () => {
    expect(isIneFormatValid('123456789AB')).toBe(true);
    expect(isIneFormatValid('1234567890Z')).toBe(true);
  });

  it('accepte un format valide en minuscules après normalisation', () => {
    expect(isIneFormatValid('123456789ab'.toUpperCase())).toBe(true);
  });

  it('refuse un INE trop court', () => {
    expect(isIneFormatValid('12345AB')).toBe(false);
  });

  it('refuse un INE trop long', () => {
    expect(isIneFormatValid('123456789ABCD')).toBe(false);
  });

  it('refuse un INE avec des caractères invalides', () => {
    expect(isIneFormatValid('12345-789AB')).toBe(false);
  });

  it('refuse un INE dont le dernier caractère n\'est pas une lettre', () => {
    expect(isIneFormatValid('1234567890 1')).toBe(false);
    expect(isIneFormatValid('123456789012')).toBe(false);
  });

  it('refuse une valeur non-string', () => {
    expect(isIneFormatValid(undefined)).toBe(false);
    expect(isIneFormatValid(null)).toBe(false);
    expect(isIneFormatValid(123456789)).toBe(false);
  });

  it('normalise en majuscules et sans espaces superflus', () => {
    expect(normalizeIne(' 123456789ab ')).toBe('123456789AB');
  });
});
