import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function getClasses() {
  const operatorsHTML = await fetch(
    'https://gamepress.gg/arknights/tier-list/arknights-operator-tier-list',
  );
  const operators = parse(await operatorsHTML.text());

  const classes = operators
    .querySelectorAll('.profession-filter-section')
    .map((classes) => {
      const clas = classes.getAttribute('class').split(' ')[0].split('-')[0];
      const icon = classes
        .querySelector('.profession-filter-icon img')
        .getAttribute('src');
      const subClass = classes
        .querySelectorAll('.subprofession-filter')
        .map((sub) => {
          const name = sub.textContent.replaceAll(' ', '');
          const icon = sub
            .querySelector('.subprofession-icon-container img')
            .getAttribute('src');
          return { name: name, icon: icon };
        });
      return { name: clas, icon: icon, subClass: subClass };
    });
  return classes;
}
