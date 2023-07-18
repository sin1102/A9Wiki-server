import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

export const getStat = async (url) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const html = parse(text);
    const scripts = html.querySelectorAll('script');
    const stats = [];
    for (const script of scripts) {
      if (script.text.includes('myStats')) {
        const removals = script.text.substring(
          0,
          script.text.indexOf('myStats') + 11,
        );
        const secremovals = script.text.substring(
          script.text.indexOf('var summon_stats'),
          script.text.length,
        );
        let formattedText = script.text.replace(removals, '');
        formattedText = formattedText.replace(secremovals, '');
        formattedText = formattedText.substring(0, formattedText.length - 3);
        formattedText = parse(formattedText).rawText.replaceAll('\t', '');
        formattedText = formattedText.replaceAll('"', '');
        formattedText = formattedText.replaceAll(',', '');
        const ne = formattedText.substring(0, formattedText.indexOf('}') + 1);
        formattedText = formattedText.replace(ne, '');
        const [, ...rest] = ne.split('\n');
        const costs = rest[4].substring(
          rest[2].indexOf(' ') + 1,
          rest[2].length,
        );
        const statDict = {
          lv: '1',
          hp: rest[4].substring(rest[4].indexOf(' ') + 1, rest[4].length),
          atk: rest[5].substring(rest[5].indexOf(' ') + 1, rest[5].length),
          def: rest[6].substring(rest[6].indexOf(' ') + 1, rest[6].length),
          resist: rest[2].substring(rest[1].indexOf(' ') + 1, rest[1].length),
          deploy: html
            .querySelectorAll(
              '.other-stat-cell .other-stat-value-cell .effect-description',
            )[1]
            .text.replaceAll('\n', ''),
          cost: rest[4].substring(rest[2].indexOf(' ') + 1, rest[2].length),
          interval: html
            .querySelectorAll(
              '.other-stat-cell .other-stat-value-cell .effect-description',
            )[4]
            .text.replaceAll('\n', ''),
          block: rest[7].substring(rest[7].indexOf(' ' + 1), rest[7].length),
        };
        stats.push(statDict);
        const max = formattedText.substring(0, formattedText.indexOf('}') + 1);
        formattedText = formattedText.replace(max, '');
        const [, ...rests] = max.split('\n');

        const maxDict = {
          cost: costs,
          lv: rests[1].substring(rests[1].indexOf(' ') + 1, rests[1].length),
          hp: rests[2].substring(rests[2].indexOf(' ') + 1, rests[2].length),
          atk: rests[3].substring(rests[3].indexOf(' ') + 1, rests[3].length),
          def: rests[4].substring(rests[4].indexOf(' ') + 1, rests[4].length),
          block: rests[5].substring(rests[5].indexOf(' ') + 1, rests[5].length),
        };
        stats.push(maxDict);
        formattedText = formattedText.substring(2, formattedText.length);
        if (formattedText.includes('e1')) {
          let formattedText2 = formattedText;
          const cost = formattedText.substring(
            formattedText.indexOf('cost') + 6,
            formattedText.indexOf('cost') + 8,
          );

          formattedText = formattedText.replace(
            formattedText.substring(0, formattedText.indexOf('Max')),
            '',
          );
          formattedText2 = formattedText2.replace(
            formattedText2.substring(0, formattedText2.indexOf('Base')),
            '',
          );

          const ne = formattedText.substring(
            formattedText.indexOf('Max') + 1,
            formattedText.indexOf('}') + 1,
          );
          const ne2 = formattedText2.substring(
            formattedText2.indexOf('Base') + 1,
            formattedText2.indexOf('}') + 1,
          );
          formattedText2 = formattedText2.replace(ne2, '');
          formattedText = formattedText.replace(ne, '');

          const [, ...rest] = ne.split('\n');
          const statDict = {
            cost: cost,
            lv: rest[0].substring(rest[0].indexOf(' ') + 1, rest[0].length),
            hp: rest[1].substring(rest[1].indexOf(' ') + 1, rest[1].length),
            atk: rest[2].substring(rest[2].indexOf(' ') + 1, rest[2].length),
            def: rest[3].substring(rest[3].indexOf(' ') + 1, rest[3].length),
            block: rest[4].substring(rest[4].indexOf(' ') + 1, rest[4].length),
          };
          const [, ...rest2] = ne2.split('\n');
          const statDict2 = {
            cost: cost,
            lv: '1',
            hp: rest2[0].substring(rest2[0].indexOf(' ') + 1, rest2[0].length),
            atk: rest2[1].substring(rest2[1].indexOf(' ') + 1, rest2[1].length),
            def: rest2[2].substring(rest2[2].indexOf(' ') + 1, rest2[2].length),
            block: rest2[3].substring(
              rest2[3].indexOf(' ') + 1,
              rest2[3].length,
            ),
          };
          stats.push(statDict);
          stats.push(statDict2);
          formattedText = formattedText.substring(1, formattedText.length);
        }
        if (formattedText.includes('e2')) {
          let formattedText2 = formattedText;
          const cost = formattedText.substring(
            formattedText.indexOf('cost') + 6,
            formattedText.indexOf('cost') + 8,
          );
          formattedText = formattedText.replace(
            formattedText.substring(0, formattedText.indexOf('Max')),
            '',
          );
          formattedText2 = formattedText2.replace(
            formattedText2.substring(0, formattedText2.indexOf('Base')),
            '',
          );

          const ne = formattedText.substring(
            formattedText.indexOf('Max') + 1,
            formattedText.indexOf('}') + 1,
          );
          const ne2 = formattedText2.substring(
            formattedText2.indexOf('Base') + 1,
            formattedText2.indexOf('}') + 1,
          );
          formattedText = formattedText.replace(ne, '');
          formattedText2 = formattedText2.replace(ne2, '');
          const [, ...rest] = ne.split('\n');
          const statDict = {
            cost: cost,
            lv: rest[0].substring(rest[0].indexOf(' ') + 1, rest[0].length),
            hp: rest[1].substring(rest[1].indexOf(' ') + 1, rest[1].length),
            atk: rest[2].substring(rest[2].indexOf(' ') + 1, rest[2].length),
            def: rest[3].substring(rest[3].indexOf(' ') + 1, rest[3].length),
            block: rest[4].substring(rest[4].indexOf(' ') + 1, rest[4].length),
          };
          const [, ...rest2] = ne2.split('\n');
          const statDict2 = {
            cost: cost,
            lv: '1',
            hp: rest2[0].substring(rest2[0].indexOf(' ') + 1, rest2[0].length),
            atk: rest2[1].substring(rest2[1].indexOf(' ') + 1, rest2[1].length),
            def: rest2[2].substring(rest2[2].indexOf(' ') + 1, rest2[2].length),
            block: rest2[3].substring(
              rest2[3].indexOf(' ') + 1,
              rest2[3].length,
            ),
          };
          stats.push(statDict);
          stats.push(statDict2);
          formattedText = formattedText.substring(1, formattedText.length);
        }
      }
    }
    const statistics = {
      base: stats[0],
      e0max: stats[1],
    };
    if (stats[2].hp) {
      statistics['e1max'] = stats[2];
      statistics['e1min'] = stats[3];
    }
    if (stats[3].hp) {
      statistics['e2max'] = stats[4];
      statistics['e2min'] = stats[5];
    }
    return statistics;
  } catch (err) {
    return {
      base: {
        error:
          'something went wrong, most likely operator does not have stats yet on gp',
      },
      e0max: {
        error:
          'something went wrong, most likely operator does not have stats yet on gp',
      },
      e1max: {
        error:
          'something went wrong, most likely operator does not have stats yet on gp',
      },
      e2max: {
        error:
          'something went wrong, most likely operator does not have stats yet on gp',
      },
    };
  }
};
