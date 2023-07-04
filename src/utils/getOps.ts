import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function getOps() {
  const operatorsHTML = await fetch(
    'https://gamepress.gg/arknights/tools/interactive-operator-list#tags=null##stats',
  );
  const operators = parse(await operatorsHTML.text());
  const data = operators.querySelectorAll('.operator-cell').map((op) => {
    const name = op
      .querySelector('.operator-title-actual')
      .textContent.replaceAll('(', '')
      .replaceAll(')', '')
      .replace(/(?<!-)\bthe\b(?!\s*-)*/gi, '')
      .replaceAll("'", '')
      .replaceAll('.', '')
      .replaceAll(' ', '-')
      .replaceAll('---', '-')
      .replaceAll('--', '-')
      .replaceAll('ł', 'l')
      .replaceAll('ë', 'e')
      .toLowerCase();
    const icon =
      op.querySelector('.operator-icon img') != null
        ? op.querySelector('.operator-icon img').getAttribute('src')
        : '';
    const classIcon = op.querySelector('.info-div img').getAttribute('src');
    return { name, icon, classIcon };
  });
  return data;
}
