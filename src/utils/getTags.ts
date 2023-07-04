import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function getTags() {
  const link = await fetch(
    'https://gamepress.gg/arknights/tools/arknights-recruitment-tag-filter',
  );
  const tags = parse(await link.text());
  const alltags = tags.querySelectorAll('.filter-table').map((tag) => {
    const category = tag.querySelector('thead th').textContent;
    const tagName = tag
      .querySelectorAll('tbody td')
      .map((tagname) => tagname.textContent.replaceAll(/\n/g, ''));
    return { category, tagName };
  });

  const t = [
    'aoe',
    'crowd-control',
    'debuff',
    'defense',
    'dp-recovery',
    'dps',
    'fast-redeploy',
    'healing',
    'nuker',
    'robot',
    'shift',
    'slow',
    'starter',
    'summon',
    'support',
    'survival',
  ];
  alltags[3].tagName = t;
  alltags.pop();
  return alltags;
}
