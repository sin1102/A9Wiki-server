import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function getTier() {
  const operatorsHTML = await fetch(
    'https://gamepress.gg/arknights/tier-list/arknights-operator-tier-list',
  );
  const operators = parse(await operatorsHTML.text());

  const tierList = operators
    .querySelectorAll('.operator-tier-container')
    .map((cate) => {
      const clas = cate
        .querySelector('.main-title')
        .textContent.replaceAll('\n', ' ')
        .split('  ');
      clas.shift();
      clas[0] = clas[0].replaceAll(' ', '').toLowerCase();
      clas[1] = clas[1].replaceAll(' ', '');
      const tier = cate.querySelectorAll('.tier-row-filter').map((tier) => {
        const tie = tier.getAttribute('data-tier');
        const op = tier.querySelectorAll('.tier-list-cell-row').map((op) => {
          const name = op
            .querySelector('.tier-list-content-left a')
            .getAttribute('href')
            .split('/')
            .pop();
          const explain = op
            .querySelector('.tier-expl-container')
            .textContent.split('Overview')[0]
            .replace(/(\n|<br>|<\/?span[^>]*>)/g, '')
            .split(/(?=[+=-])/);
          explain.shift();
          return { name: name, explain: explain };
        });
        return { tier: tie, ops: op };
      });
      return { clas: clas, tier: tier };
    });
  return tierList;
}
