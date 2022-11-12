import Color from 'color';
import { convert } from 'html-to-text';

export const send = async (apiSecret, emailData = {}) => {
  const emailRequest = formatEmailData(emailData);
  const emailResponse = await fetch('https://api.sendfern.com/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sendfern-token': apiSecret,
    },
    body: JSON.stringify(emailRequest),
  }).then((r) => r.json()).catch((err) => console.log(err));
  return emailResponse;
};

// Normalizes the email data before sending to emailHtml
export const formatEmailData = (emailData = {}) => ({
  // system settings
  disableDarkMode: emailData.disableDarkMode || false,
  // api settings
  to: emailData.to,
  footerContent: emailData.footerContent || '',
  content: emailData.content || '',
  preview: emailData.preview,
  subject: emailData.subject,
  scheduledAt: emailData.scheduledAt,
  // org settings
  hasMarketing: emailData.hasMarketing || false,
  name: emailData.name,
  logo: emailData.logo,
  logoWidth: emailData.logoWidth || 200,
  brandColor: (/^#[0-9A-F]{6}$/i.test(emailData.brandColor || '') && emailData.brandColor) || '#3b82f6',
  theme: emailData.theme,
  website: emailData.website,
  senderName: emailData.senderName,
  replyTo: emailData.replyTo,
  streetAddress1: emailData.streetAddress1,
  streetAddress2: emailData.streetAddress2,
  city: emailData.city,
  region: emailData.region,
  zip: emailData.zip,
  country: emailData.country,
  unsubscribeLink: emailData.unsubscribeLink,
  showReferrer: emailData.showReferrer || false,
});

// Our exposed hook for generating the email using the given styling
export const emailHtml = (emailData = {}) => emailWrapper(style(emailData), body(emailData));

// Our exposed hook for generating the text version of the email.
export const emailText = (emailData = {}) => [content(emailData?.content), footer(emailData)]
  .map(convert).join('\n\n');

// Generates our email html
const emailWrapper = (style, children) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title></title>
    <style type="text/css" rel="stylesheet" media="all">
    ${style}
    </style>
    <!--[if mso]>
      <style type="text/css">
        .f-fallback {
          font-family: Arial, sans-serif;
        }
      </style>
    <![endif]-->
  </head>
  <body>
  ${children}
  </body>
</html>
`;

const linkColor = (hex) => {
  if (Color(hex).luminosity() > 0.4) {
    if (Color(hex).luminosity() < 0.2) {
      Color(hex).lightness(20).hex();
    } else {
      Color(hex).hex();
    }
  } else {
    Color(hex).lightness(40).hex();
  }
};

// Generates the stylesheet for our emails
const style = (emailData = {}) => `
      /* Base ------------------------------ */

      ${theme(emailData, 'fontImport')}
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        -webkit-text-size-adjust: none;
      }

      a {
        color: ${linkColor(emailData?.brandColor || '#3b82f6')};
      }

      a img {
        border: none;
      }

      td {
        word-break: break-word;
      }

      .preheader {
        display: none !important;
        visibility: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      }
      /* Type ------------------------------ */

      body,
      td,
      th {
        ${theme(emailData, 'fontFamily')}
      }

      ${theme(emailData, 'typography')}
      /* Utilities ------------------------------ */

      .align-right {
        text-align: right;
      }

      .align-left {
        text-align: left;
      }

      .align-center {
        text-align: center;
      }
      /* Buttons ------------------------------ */

      ${theme(emailData, 'button')}

      /* Data table ------------------------------ */

      body {
        background-color: ${theme(emailData, 'emailBackgroundColor')};
        color: #51545e;
      }

      p {
        color: #51545e;
      }

      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        background-color: ${theme(emailData, 'emailBackgroundColor')};
      }

      .email-content {
        width: 100%;
        margin: 0;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
      }
      /* Masthead ----------------------- */

      ${theme(emailData, 'masthead')}

      /* Body ------------------------------ */

      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
      }

      .email-body_inner {
        width: ${theme(emailData, 'contentWidth')}px;
        margin: 0 auto;
        padding: 0;
        -premailer-width: ${theme(emailData, 'contentWidth')}px;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        background-color: #ffffff;
      }

      .email-footer {
        width: ${theme(emailData, 'contentWidth')}px;
        margin: 0 auto;
        padding: 0;
        -premailer-width: ${theme(emailData, 'contentWidth')}px;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: ${theme(emailData, 'emailFooterAlignment')};
      }

      .email-footer p {
        color: ${theme(emailData, 'footerTextColor')};
      }

      .email-footer .referrer {
        color: ${theme(emailData, 'footerTextColor')};
        text-decoration: none;
      }

      ${theme(emailData, 'bodyAction')}

      ${theme(emailData, 'bodyDivider')}

      ${theme(emailData, 'bodySpacer')}

      ${theme(emailData, 'bodyContent')}

      ${theme(emailData, 'bodyImage')}

      ${theme(emailData, 'bodyList')}

      ${theme(emailData, 'contentCell')}
      
      /*Media Queries ------------------------------ */

      @media only screen and (max-width: 600px) {
        .email-body_inner,
        .email-footer {
          width: 100% !important;
        }
      }

      ${
  !emailData?.disableDarkMode
    ? `
              @media (prefers-color-scheme: dark) {
                ${theme(emailData, 'darkMode')}
              }
          ` : ''
}
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }
`;

// Generates the body part of our emails
const body = (emailData = {}) => `
    ${emailData?.preview ? `<span class="preheader">${emailData?.preview}</span>` : ''}
    <table
      class="email-wrapper"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
    >
      <tr>
        <td align="center" style="padding: 0 10px">
          <table
            class="email-content"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
          >
            ${emailData?.logo
    ? `
              <tr>
                <td align="center" style="font-size:0px;padding:20px 0;word-break:break-word;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="border-collapse:collapse;border-spacing:0px;">
                    <tbody>
                      <tr>
                        <td style="width:${emailData.logoWidth || 280}px;">
                          ${emailData.website ? `<a href="${emailData?.website}" target="_blank" class="f-fallback email-masthead_name">` : ''}
                          <img height="auto" src="${emailData?.logo}"
                            style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                            width="100" alt="${emailData?.name || ''}" />
                          ${emailData.website ? '</a>' : ''}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              `
    : `
              <tr>
                <td class="email-masthead">
                  ${emailData.website
    ? `
                      <a href="${emailData.website}" target="_blank" class="f-fallback email-masthead_name">
                        ${emailData?.name || ''}
                      </a>
                    `
    : `
                      <span class="f-fallback email-masthead_name">
                        ${emailData?.name || ''}
                      </span>
                    `
}
                </td>
              </tr>
              `
}
            <!-- Email Body -->
            <tr>
              <td
                class="email-body"
                width="${theme(emailData, 'contentWidth')}"
                cellpadding="0"
                cellspacing="0"
              >
                <table
                  class="email-body_inner"
                  align="center"
                  width="${theme(emailData, 'contentWidth')}"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                >
                  <!-- Body content -->
                  <tr>
                    <td class="body-content">
                      ${theme(emailData, 'topBar')}
                      <div class="f-fallback content-cell">
                        ${content(emailData?.content)}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
              <tr>
                <td>
                  <table
                    class="email-footer"
                    align="center"
                    width="${theme(emailData, 'contentWidth')}"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                  >
                    <tr>
                      <td class="content-cell" align="${theme(emailData, 'emailFooterAlignment')}">
                        ${footer(emailData)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

// Generate footer information
const footer = (emailData = {}) => `
  ${emailData?.footerContent ? `
    <p class="f-fallback sub align-${theme(emailData, 'emailFooterAlignment')}">
      ${emailData.footerContent}
    </p>
  ` : ''}
  ${emailData?.hasMarketing ? `
    <p class="f-fallback sub align-${theme(emailData, 'emailFooterAlignment')}">
      No longer want to receive these emails? <a href="${emailData?.unsubscribeLink}">Unsubscribe</a>.                          
    </p>
    <p class="f-fallback sub align-${theme(emailData, 'emailFooterAlignment')}">
      &copy; ${new Date().getFullYear()} ${emailData?.name}. All rights reserved. ${emailData.streetAddress1 || ''}${emailData.streetAddress2 ? `, ${emailData.streetAddress2}` : ''}, ${emailData.city || ''}, ${emailData.region || ''} ${emailData.zip || ''}, ${emailData.country || ''}.
    </p>
  ` : `
    <p class="f-fallback sub align-${theme(emailData, 'emailFooterAlignment')}">
      &copy; ${new Date().getFullYear()} ${emailData?.name}. All rights reserved.
    </p>
  `}
  ${emailData?.showReferrer ? `
    <p class="f-fallback sub align-${theme(emailData, 'emailFooterAlignment')}">
      Powered by <a class="referrer" href="https://sendfern.com">Sendfern</a>.
    </p>
  ` : ''}
`;

// Generates the content of our emails
const content = (contentData) => {
  if (typeof contentData === 'string') { // If our contentData is a string treat it as a text block
    return emailContent_text({ content: contentData });
  } if (contentData && typeof contentData === 'object') {
    if (Array.isArray(contentData)) { // If our contentData is an array get the block for each item.
      return contentData.map((block) => blocks(block)).join('');
    } // Otherwise return the single block
    return blocks(contentData);
  } // Otherwise return empty...
  console.log('Invalid contentData', contentData);
  return '';
};

// Converts one block of content into it's type
const blocks = (block) => {
  if (typeof block === 'string') { // If our block is a string treat it as a text block
    return emailContent_text({ content: block });
  } if (block && typeof block === 'object') {
    switch (block.type) {
      case 'text':
        return emailContent_text(block);
      case 'button':
        return emailContent_button(block);
      case 'image':
        return emailContent_image(block);
      case 'divider':
        return emailContent_divider();
      case 'spacer':
        return emailContent_spacer();
      case 'code':
        return emailContent_code(block);
      case 'heading':
        return emailContent_heading(block);
      case 'list':
        return emailContent_list(block);
      default: // If we do not recognise the block type return empty
        console.log('Invalid block', block);
        return '';
    }
  } else { // Otherwise return empty...
    console.log('Invalid block', block);
    return '';
  }
};

// Text content block
const emailContent_text = (block) => `
  <p class="f-fallback${block?.subdued ? ' sub' : ''}">
    ${block?.content || ''}
  </p>
`;

// Button content block
const emailContent_button = (block) => `
  <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
          <tr>
            <td>
              <a href="${block.link || '#'}" class="f-fallback button" target="_blank">${block.label || 'Learn More'}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

// Image content block
const emailContent_image = (block) => `
  <table class="body-image" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
    <tr>
      <td style="width:${block.width ? `${block.width || 280}px` : '100%'};">
        ${block.link ? `<a href="${block?.link}" target="_blank" class="f-fallback">` : ''}
        <img height="auto" src="${block?.source}"
          style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
          width="100"${block?.alt ? ` alt="${escapeHtml(block.alt)}"` : ''} />
        ${block.link ? '</a>' : ''}
      </td>
    </tr>
  </table>
`;

// Divider content block
const emailContent_divider = () => `
  <table class="body-divider" role="presentation">
    <tr>
      <td>
      </td>
    </tr>
  </table>
`;

// Spacer content block
const emailContent_spacer = () => `
  <table class="body-spacer" role="presentation">
    <tr>
      <td>
      </td>
    </tr>
  </table>
`;

// Code content block
const emailContent_code = (block) => `
  <pre>${block?.content}</pre>
`;

// Heading content block
const emailContent_heading = (block) => {
  switch (block.headingType) {
    case 'h1':
      return `<h1>${block.content || ''}</h1>`;
    case 'h2':
      return `<h2>${block.content || ''}</h2>`;
    case 'h3':
      return `<h3>${block.content || ''}</h3>`;
    case 'h4':
      return `<h4>${block.content || ''}</h4>`;
    case 'h5':
      return `<h5>${block.content || ''}</h5>`;
    case 'h6':
      return `<h6>${block.content || ''}</h6>`;
    default:
      return `<h2>${block.content || ''}</h2>`;
  }
};

// List content block
const emailContent_list = (block) => {
  if (block.ordered) {
    return `
    <table class="body-list" role="presentation">
      <tr>
        <td>
          <ol style="margin:0; margin-left: 25px; padding:0;" align="left" type="1">
            ${block.items.map((item) => `<li>${item}</li>`).join('')}
          </ol>
        </td>
      </tr>
    </table>
    `;
  }
  return `
    <table class="body-list" role="presentation">
      <tr>
        <td>
          <ul style="margin:0; margin-left: 25px; padding:0;" align="left" type="disc">
            ${block.items.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </td>
      </tr>
    </table>
    `;
};

// Sanitize html strings
const escapeHtml = (unsafe = '') => unsafe
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

// Our default theme for mail styling if none is explicilty set (or set to "default")
const defaultTheme = 'basic';

// Our one-line for getting email theme styles
const theme = (emailData = {}, accessor = '') => (emailThemes(emailData)?.[emailData?.theme]?.[accessor] ?? emailThemes(emailData)?.[defaultTheme]?.[accessor] ?? '');

// Our email styles
const emailThemes = (emailData = {}) => ({
  modern: {
    topBar: `
      <table cellpadding="0" cellspacing="0" border="0" style="border:none;border-collapse:separate;font-size:1px;height:2px;line-height:3px;width:100%">
        <tbody>
          <tr>
            <td valign="top" style="background-color:${emailData?.brandColor || '#3b82f6'};border:none;width:100%" bgcolor="${emailData?.brandColor || '#3b82f6'}"></td>
          </tr>
        </tbody>
      </table>
    `,
    masthead: `
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }

      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: ${emailData?.brandColor || '#3b82f6'};
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
    `,
    bodyContent: '',
    bodyDivider: `
      .body-divider {
        margin-top: 25px;
        padding-top: 16px;
        border-top: 1px solid #eaeaec;
        width: 100%;
      }
    `,
    bodySpacer: `
      .body-spacer {
        margin-top: 25px;
        width: 100%;
      }
    `,
    bodyImage: `
      .body-image {
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    bodyList: `
      .body-list {
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: left;
      }
    `,
    bodyAction: `
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    contentCell: `
      .content-cell {
        padding: 45px;
      }
    `,
    emailBackgroundColor: Color(emailData?.brandColor || '#3b82f6').lightness(90).hex(),
    footerTextColor: Color(emailData?.brandColor || '#3b82f6').lightness(90).luminosity() > 0.5 ? '#51545e' : '#FFF',
    button: `
      .button {
        background-color: ${emailData?.brandColor || '#3b82f6'};
        border-top: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-right: 18px solid ${emailData?.brandColor || '#3b82f6'};
        border-bottom: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-left: 18px solid ${emailData?.brandColor || '#3b82f6'};
        display: inline-block;
        color: ${Color(emailData?.brandColor || '#3b82f6').luminosity() > 0.5 ? '#000' : '#FFF'} !important;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        box-sizing: border-box;
      }

      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
          text-align: center !important;
        }
      }
    `,
    fontImport: '@import url(\'https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap\');',
    fontFamily: 'font-family: \'Roboto\', Helvetica, Arial, sans-serif;',
    contentWidth: '570',
    typography: `
      h1 {
        margin-top: 0;
        color: #333333;
        font-size: 22px;
        font-weight: bold;
        text-align: left;
      }

      h2 {
        margin-top: 0;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }

      h3 {
        margin-top: 0;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }

      td,
      th {
        font-size: 16px;
      }

      pre {
        padding:16px 24px;
        border:1px solid #EEEEEE;
        background-color:#F4F4F4;
        border-radius:3px;
        font-family:monospace;
        margin: 0.4em 0 1.1875em;
      }

      li {
        margin: 0 0 0.4em;
      }

      p,
      ul,
      ol,
      blockquote {
        margin: 0.4em 0 1.1875em;
        font-size: 16px;
        line-height: 1.625;
      }

      p.sub {
        font-size: 13px;
      }
    `,
    emailFooterAlignment: 'center',
    darkMode: `
      body,
      .email-body,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #202020 !important;
        color: #fff !important;
      }
      .email-body_inner {
        background-color: #333333 !important;
      }
      p,
      a,
      ul,
      ol,
      li,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .email-masthead_name {
        text-shadow: none !important;
        color: #D5D5D5 !important;
      }
    `,
  },
  basic: {
    topBar: '',
    masthead: `
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }

      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #a8aaaf;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
    `,
    bodyContent: '',
    bodyDivider: `
      .body-divider {
        margin-top: 25px;
        padding-top: 16px;
        border-top: 1px solid #eaeaec;
        width: 100%;
      }
    `,
    bodySpacer: `
      .body-spacer {
        margin-top: 25px;
        width: 100%;
      }
    `,
    bodyImage: `
      .body-image {
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    bodyList: `
      .body-list {
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: left;
      }
    `,
    bodyAction: `
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    contentCell: `
      .content-cell {
        padding: 45px;
      }
    `,
    emailBackgroundColor: '#f2f4f6',
    footerTextColor: '#a8aaaf',
    button: `
      .button {
        background-color: ${emailData?.brandColor || '#3b82f6'};
        border-top: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-right: 18px solid ${emailData?.brandColor || '#3b82f6'};
        border-bottom: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-left: 18px solid ${emailData?.brandColor || '#3b82f6'};
        display: inline-block;
        color: ${Color(emailData?.brandColor || '#3b82f6').luminosity() > 0.5 ? '#000' : '#FFF'} !important;
        text-decoration: none;
        border-radius: 0.375rem;
        -webkit-text-size-adjust: none;
        box-sizing: border-box;
      }

      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
          text-align: center !important;
        }
      }
    `,
    fontImport: '@import url(\'https://fonts.googleapis.com/css?family=Inter:400,700&display=swap\');',
    fontFamily: 'font-family: \'Inter\', Helvetica, Arial, sans-serif;',
    contentWidth: '570',
    typography: `
      h1 {
        margin-top: 0;
        color: #333333;
        font-size: 22px;
        font-weight: bold;
        text-align: left;
      }

      h2 {
        margin-top: 0;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }

      h3 {
        margin-top: 0;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }

      td,
      th {
        font-size: 16px;
      }

      pre {
        padding:16px 24px;
        border:1px solid #EEEEEE;
        background-color:#F4F4F4;
        border-radius:3px;
        font-family:monospace;
        margin: 0.4em 0 1.1875em;
      }

      li {
        margin: 0 0 0.4em;
      }

      p,
      ul,
      ol,
      blockquote {
        margin: 0.4em 0 1.1875em;
        font-size: 16px;
        line-height: 1.625;
      }

      p.sub {
        font-size: 13px;
      }
    `,
    emailFooterAlignment: 'center',
    darkMode: `
      body,
      .email-body,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #202020 !important;
        color: #fff !important;
      }
      .email-body_inner {
        background-color: #333333 !important;
      }
      p,
      a,
      ul,
      ol,
      li,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .email-masthead_name {
        text-shadow: none !important;
        color: #D5D5D5 !important;
      }
    `,
  },
  minimal: {
    topBar: '',
    masthead: `
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }

      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #a8aaaf;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
    `,
    bodyContent: `
      .body-content {
        border: 1px solid #dfe3e8
      }
    `,
    bodyDivider: `
      .body-divider {
        margin-top: 16px;
        padding-top: 7px;
        border-top: 1px solid #dfe3e8;
        width: 100%;
      }
    `,
    bodySpacer: `
      .body-spacer {
        margin-top: 16px;
        width: 100%;
      }
    `,
    bodyImage: `
      .body-image {
        margin: 16px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    bodyList: `
      .body-list {
        margin: 16px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: left;
      }
    `,
    bodyAction: `
      .body-action {
        width: 100%;
        margin: 16px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    contentCell: `
      .content-cell {
        padding: 24px;
      }
    `,
    emailBackgroundColor: '#ffffff',
    footerTextColor: '#a8aaaf',
    button: `
      .button {
        background-color: ${emailData?.brandColor || '#3b82f6'};
        border-top: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-right: 18px solid ${emailData?.brandColor || '#3b82f6'};
        border-bottom: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-left: 18px solid ${emailData?.brandColor || '#3b82f6'};
        display: inline-block;
        color: ${Color(emailData?.brandColor || '#3b82f6').luminosity() > 0.5 ? '#000' : '#FFF'} !important;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        box-sizing: border-box;
      }

      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
          text-align: center !important;
        }
      }
    `,
    fontImport: '@import url(\'https://fonts.googleapis.com/css?family=Inter:400,700&display=swap\');',
    fontFamily: 'font-family: \'Inter\', Helvetica, Arial, sans-serif;',
    contentWidth: '470',
    typography: `
      h1 {
        margin-top: 0;
        color: #333333;
        font-size: 22px;
        font-weight: bold;
        text-align: left;
      }

      h2 {
        margin-top: 0;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }

      h3 {
        margin-top: 0;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }

      td,
      th {
        font-size: 15px;
      }

      pre {
        padding:16px 24px;
        border:1px solid #EEEEEE;
        background-color:#F4F4F4;
        border-radius:3px;
        font-family:monospace;
        margin: 0.4em 0 1.1875em;
      }

      li {
        margin: 0 0 0.4em;
      }

      p,
      ul,
      ol,
      blockquote {
        margin: 0.4em 0 1.1875em;
        font-size: 15px;
        line-height: 20px;
      }

      p.sub {
        font-size: 13px;
      }
    `,
    emailFooterAlignment: 'center',
    darkMode: `
      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #202020 !important;
        color: #fff !important;
      }
      .body-content {
        border: 1px solid #333333;
      }
      p,
      a,
      ul,
      ol,
      li,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .email-masthead_name {
        text-shadow: none !important;
        color: #D5D5D5 !important;
      }
    `,
  },
  plain: {
    topBar: '',
    masthead: `
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }

      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #a8aaaf;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
    `,
    bodyContent: '',
    bodyDivider: `
      .body-divider {
        margin-top: 16px;
        padding-top: 7px;
        border-top: 1px solid #dfe3e8;
        width: 100%;
      }
    `,
    bodySpacer: `
      .body-spacer {
        margin-top: 16px;
        width: 100%;
      }
    `,
    bodyImage: `
      .body-image {
        margin: 16px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    bodyList: `
      .body-list {
        margin: 16px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: left;
      }
    `,
    bodyAction: `
      .body-action {
        width: 100%;
        margin: 16px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
    `,
    contentCell: '',
    emailBackgroundColor: '#ffffff',
    footerTextColor: '#a8aaaf',
    button: `
      .button {
        background-color: ${emailData?.brandColor || '#3b82f6'};
        border-top: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-right: 18px solid ${emailData?.brandColor || '#3b82f6'};
        border-bottom: 10px solid ${emailData?.brandColor || '#3b82f6'};
        border-left: 18px solid ${emailData?.brandColor || '#3b82f6'};
        display: inline-block;
        color: ${Color(emailData?.brandColor || '#3b82f6').luminosity() > 0.5 ? '#000' : '#FFF'} !important;
        text-decoration: none;
        -webkit-text-size-adjust: none;
        box-sizing: border-box;
      }

      @media only screen and (max-width: 500px) {
        .button {
          width: 100% !important;
          text-align: center !important;
        }
      }
    `,
    fontImport: '@import url(\'https://fonts.googleapis.com/css?family=Inter:400,700&display=swap\');',
    fontFamily: 'font-family: \'Inter\', Helvetica, Arial, sans-serif;',
    contentWidth: '470',
    typography: `
      h1 {
        margin-top: 0;
        color: #333333;
        font-size: 22px;
        font-weight: bold;
        text-align: left;
      }

      h2 {
        margin-top: 0;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
      }

      h3 {
        margin-top: 0;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
      }

      td,
      th {
        font-size: 15px;
      }

      pre {
        padding:16px 24px;
        border:1px solid #EEEEEE;
        background-color:#F4F4F4;
        border-radius:3px;
        font-family:monospace;
        margin: 0.4em 0 1.1875em;
      }

      li {
        margin: 0 0 0.4em;
      }

      p,
      ul,
      ol,
      blockquote {
        margin: 0.4em 0 1.1875em;
        font-size: 15px;
        line-height: 20px;
      }

      p.sub {
        font-size: 13px;
      }
    `,
    emailFooterAlignment: 'left',
    darkMode: `
      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #202020 !important;
        color: #fff !important;
      }
      p,
      a,
      ul,
      ol,
      li,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .email-masthead_name {
        text-shadow: none !important;
        color: #D5D5D5 !important;
      }
    `,
  },
});

export const sampleMinimal = 'This is a live preview of your emails! Customize my appearance using <a target="_blank" href="https://sendfern.com">Sendfern</a>.';

export const sampleBasic = [
  'This is a live preview of your emails! Customize my appearance using <a target="_blank" href="https://sendfern.com">Sendfern</a>.',
  {
    type: 'button',
    link: 'https://example.com',
    label: 'Example Button',
  },
];

export const sampleFull = [
  'This is a live preview of your emails! Customize my appearance using <a target="_blank" href="https://sendfern.com">Sendfern</a>.',
  {
    type: 'button',
    link: 'https://example.com',
    label: 'Example Button',
  },
  {
    type: 'spacer',
  },
  {
    type: 'text',
    content: 'I have a spacer above me!',
  },
  {
    type: 'text',
    content: 'A spacer inserts a gap in your email content.',
    subdued: true,
  },
  {
    type: 'divider',
  },
  {
    type: 'text',
    content: 'I have a divider above me!',
  },
  {
    type: 'list',
    items: [
      'Item One',
      'Item Two.',
      'Item Three',
    ],
  },
  {
    type: 'code',
    content: 'my-magic-code',
  },
  {
    type: 'image',
    link: 'https://example.com',
    width: 200,
    source: 'https://media.sendfern.com/6b413fc5-92e3-454b-b6da-3efc1ca91aaa.png',
  },
  {
    type: 'heading',
    content: 'This is a h1 heading',
    headingType: 'h1',
  },
  {
    type: 'heading',
    content: 'This is a h2 heading',
    headingType: 'h2',
  },
  {
    type: 'heading',
    content: 'This is a h3 heading',
    headingType: 'h3',
  },
];
