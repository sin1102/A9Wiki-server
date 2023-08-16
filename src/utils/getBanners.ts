import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export async function GetBanners() {
  const operatorsHTML = await fetch(
    'https://arknights.fandom.com/wiki/Headhunting/Banners/Upcoming',
  );
  const banners = parse(await operatorsHTML.text());
  let banner = banners
    .querySelectorAll('table:not(:first-child) tr:not(:first-child)')
    .map((b) => {
      const thumbnail =
        b.querySelector('img').getAttribute('data-src') == undefined
          ? b.querySelector('img').getAttribute('src')
          : b.querySelector('img').getAttribute('data-src');
      const bannerName = b.querySelector('div:first-child').textContent;
      const cnDate = b.querySelector('div:nth-child(3)').textContent;
      const ops = b.querySelectorAll('.a').map((op) => {
        const list = op.querySelector('img').getAttribute('alt').split(' ');
        list.pop();
        return list
          .join(' ')
          .replace(/(?<!-)\bthe\b(?!\s*-)*/gi, '')
          .replaceAll("'", '')
          .replaceAll('.', '')
          .replaceAll(' ', '-')
          .replaceAll('---', '-')
          .replaceAll('--', '-')
          .replaceAll('ł', 'l')
          .replaceAll('ë', 'e')
          .toLowerCase();
      });
      return {
        thumbnail: thumbnail,
        name: bannerName,
        cnDate: cnDate,
        globDate: 'not yet global',
        ops: ops,
      };
    });

  const bannersHTML = await fetch(
    'https://arknights.fandom.com/wiki/Headhunting/Banners#Current',
  );
  const bannersCurrent = parse(await bannersHTML.text());
  let bannerCurrent = bannersCurrent
    .querySelectorAll('table:nth-of-type(2)  tr:not(:first-child)')
    .map((b) => {
      const thumbnail =
        b.querySelector('img').getAttribute('data-src') == undefined
          ? b.querySelector('img').getAttribute('src')
          : b.querySelector('img').getAttribute('data-src');
      const bannerName = b.querySelector('div:first-child').textContent;
      const date = b
        .querySelector('div:nth-child(3)')
        .textContent.split(/(?<=\d{4})(?=[A-Z])/);
      let globDate = '';
      let cnDate = '';
      if (date.length > 1) {
        globDate = date[1];
        cnDate = date[0];
      } else {
        globDate = date[0];
        cnDate = 'only global';
      }
      const ops = b.querySelectorAll('.a').map((op) => {
        const list = op.querySelector('img').getAttribute('alt').split(' ');
        list.pop();
        return list
          .join(' ')
          .replace(/(?<!-)\bthe\b(?!\s*-)*/gi, '')
          .replaceAll("'", '')
          .replaceAll('.', '')
          .replaceAll(' ', '-')
          .replaceAll('---', '-')
          .replaceAll('--', '-')
          .replaceAll('ł', 'l')
          .replaceAll('ë', 'e')
          .toLowerCase();
      });
      return {
        thumbnail: thumbnail,
        name: bannerName,
        cnDate: cnDate,
        globDate: globDate,
        ops: ops,
      };
    });
  const bannerUp = bannersCurrent
    .querySelectorAll('table:nth-of-type(3)  tr:not(:first-child)')
    .map((b) => {
      const thumbnail =
        b.querySelector('img').getAttribute('data-src') == undefined
          ? b.querySelector('img').getAttribute('src')
          : b.querySelector('img').getAttribute('data-src');
      const bannerName = b.querySelector('div:first-child').textContent;
      const date = b
        .querySelector('div:nth-child(3)')
        .textContent.split(/(?<=\d{4})(?=[A-Z])/);
      let globDate = '';
      let cnDate = '';
      if (date.length > 1) {
        globDate = date[1];
        cnDate = date[0];
      } else {
        globDate = date[0];
        cnDate = 'only global';
      }
      const ops = b.querySelectorAll('.a').map((op) => {
        const list = op.querySelector('img').getAttribute('alt').split(' ');
        list.pop();
        return list
          .join(' ')
          .replace(/(?<!-)\bthe\b(?!\s*-)*/gi, '')
          .replaceAll("'", '')
          .replaceAll('.', '')
          .replaceAll(' ', '-')
          .replaceAll('---', '-')
          .replaceAll('--', '-')
          .replaceAll('ł', 'l')
          .replaceAll('ë', 'e')
          .toLowerCase();
      });
      return {
        thumbnail: thumbnail,
        name: bannerName,
        cnDate: cnDate,
        globDate: globDate,
        ops: ops,
      };
    });

  const years = ['2023', '2022', '2021', '2020'];
  let bannerFormers = [];
  for (let i = 0; i < years.length; i++) {
    const bannersFormerHtml = await fetch(
      'https://arknights.fandom.com/wiki/Headhunting/Banners/Former/' +
        years[i],
    );
    const bannersFormer = parse(await bannersFormerHtml.text());
    const bannerFormer = bannersFormer
      .querySelectorAll('table:not(:first-child)  tr:not(:first-child)')
      .map((b) => {
        const thumbnail =
          b.querySelector('img').getAttribute('data-src') == undefined
            ? b.querySelector('img').getAttribute('src')
            : b.querySelector('img').getAttribute('data-src');
        const bannerName = b.querySelector('div:first-child').textContent;
        const date = b
          .querySelector('div:nth-child(3)')
          .textContent.split(/(?<=\d{4})(?=[A-Z])/);
        let globDate = '';
        let cnDate = '';
        if (date.length > 1) {
          globDate = date[1];
          cnDate = date[0];
        } else {
          globDate = date[0];
          cnDate = 'only global';
        }
        const ops = b.querySelectorAll('.a').map((op) => {
          const list = op.querySelector('img').getAttribute('alt').split(' ');
          list.pop();
          return list
            .join(' ')
            .replace(/(?<!-)\bthe\b(?!\s*-)*/gi, '')
            .replaceAll("'", '')
            .replaceAll('.', '')
            .replaceAll(' ', '-')
            .replaceAll('---', '-')
            .replaceAll('--', '-')
            .replaceAll('ł', 'l')
            .replaceAll('ë', 'e')
            .toLowerCase();
        });
        return {
          thumbnail: thumbnail,
          name: bannerName,
          cnDate: cnDate,
          globDate: globDate,
          ops: ops,
        };
      });
    bannerFormers = bannerFormers.concat(bannerFormer);
  }
  bannerCurrent = bannerCurrent.concat(bannerUp);
  banner = banner.concat(bannerCurrent);
  banner = banner.concat(bannerFormers);
  return banner;
}
