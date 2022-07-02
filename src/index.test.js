import {
  formatEmailData, emailText, sampleMinimal, sampleBasic, sampleFull,
} from '.';

describe('formatEmailData', () => {
  test('Empty Object', () => {
    const actual = formatEmailData();
    const expected = {
      // system settings
      disableDarkMode: false,
      // api settings
      to: undefined,
      footerContent: '',
      content: '',
      preview: undefined,
      // org settings
      hasMarketing: false,
      name: undefined,
      logo: undefined,
      logoWidth: 200,
      brandColor: '#3b82f6',
      theme: undefined,
      website: undefined,
      senderName: undefined,
      replyTo: undefined,
      streetAddress1: undefined,
      streetAddress2: undefined,
      city: undefined,
      region: undefined,
      zip: undefined,
      country: undefined,
    };

    expect(actual).toEqual(expected);
  });
});

describe('emailText', () => {
  test('sampleMinimal', () => {
    const text = emailText({
      content: sampleMinimal,
      name: 'Sendfern',
    });

    console.log(text);

    expect(text).toBeTruthy();
    expect(text).not.toMatch(/undefined/);
  });

  test('sampleBasic', () => {
    const text = emailText({
      content: sampleBasic,
      name: 'Sendfern',
    });

    console.log(text);

    expect(text).toBeTruthy();
    expect(text).not.toMatch(/undefined/);
  });

  test('sampleFull', () => {
    const text = emailText({
      content: sampleFull,
      name: 'Sendfern',
    });

    console.log(text);

    expect(text).toBeTruthy();
    expect(text).not.toMatch(/undefined/);
  });
});
