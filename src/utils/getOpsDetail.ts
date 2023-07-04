import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { Operators } from '../modules/operators/schemas/operators.schema';
import { getCosts } from './getCost';
import { getStat } from './getStat';

export const opsDetail = async (url) => {
  const operatorsHTML = await fetch(url);
  const operators = parse(await operatorsHTML.text());

  const operatorName = operators.querySelector('#page-title > h1').rawText;
  const rarity = operators.querySelectorAll('.rarity-cell > img').length;

  const rangeBox = operators.querySelectorAll('.operator-image .range-box');
  const cells = rangeBox.map((currRange, i) => {
    const currCells = currRange.querySelectorAll('.range-cell');
    const range = Array.from(currCells).map((cell) => {
      const blocks = Array.from(cell.querySelectorAll('span')).map((block) =>
        block.classList.contains('empty-box')
          ? 'attackable'
          : block.classList.contains('fill-box')
          ? 'unit'
          : 'null',
      );
      return blocks;
    });
    return {
      elite: i === 0 ? 'Base' : i === 1 ? 'E1' : 'E2',
      range: range,
    };
  });

  const alter =
    operators.querySelector('.alter-parent .name') != null
      ? operators
          .querySelector('.alter-parent .name')
          .textContent.replace(/\n/g, '')
          .replace(/&nbsp/g, ' ')
      : 'operator do not have alter';

  const biography = checkForExistence(
    operators.querySelector('.profile-description'),
  );

  const faction =
    operators.querySelector('.faction-cell img') != null
      ? operators.querySelector('.faction-cell img').getAttribute('src')
      : '';

  const descriptionArr = operators
    .querySelectorAll('.description-box')
    .map((box) => {
      return box.textContent.replace(/\n/g, '');
    });

  const tag = operators
    .querySelectorAll('.tag-title')
    .map((tag) => tag.textContent.replace(/\n/g, '').toLowerCase());
  tag.pop();

  const position = checkForExistence(
    operators.querySelector('.position-cell a'),
  );
  tag.push(position.toLocaleLowerCase());

  const clas = operators
    .querySelectorAll('.profession-title')
    .map((cla) => cla.textContent.replace(/\n/g, ''));
  if (clas[0]) tag.push(clas[0].toLowerCase());

  const attackType = checkForExistence(
    operators.querySelector('.traits-cell a'),
  );

  const obtainable = operators
    .querySelectorAll('.obtain-approach-table span')
    .map((existence) => existence.textContent);
  if (obtainable.length === 3) {
    if (obtainable[0] === 'Yes') obtainable[0] = 'true';
    else obtainable[0] = 'false';

    if (obtainable[1] === '(LIMITED)') obtainable[1] = 'true';
    else obtainable[1] = 'false';

    if (obtainable[2] === 'Yes') obtainable[2] = 'true';
    else obtainable[2] = 'false';
  } else {
    if (obtainable[0] === 'Yes') obtainable[0] = 'true';
    else obtainable[0] = 'false';
    if (obtainable[1] === 'Yes') obtainable[1] = 'true';
    else obtainable[1] = 'false';
    obtainable.splice(1, 0, 'false');
  }
  const availability = operators.querySelectorAll(
    '.obtain-approach-table table',
  );
  const releaseDates = {
    cn: availability[1].querySelectorAll('td')[0].rawText,
    global:
      availability[1].querySelectorAll('td')[1] != null
        ? availability[1].querySelectorAll('td')[1].rawText
        : 'operator not yet in global',
  };

  const potential = operators
    .querySelectorAll('.potential-list')
    .map((cell) => {
      return {
        name: cell.querySelector('.potential-icon').rawText.replace(/\n/g, ''),
        value: cell
          .querySelector('.potential-title')
          .rawText.replace(/\n/g, ''),
      };
    });

  const trust = potential.pop();

  const talent = operators.querySelectorAll('.talent-child').map((cell) => {
    const eliteImage = cell.querySelector('.elite-level img');
    const potential = cell.querySelector('.potential-level img');
    let loc = potential?.getAttribute('src')?.indexOf('.png');
    if (potential != null)
      while (potential!.getAttribute('src')![loc - 2] !== '/') loc -= 1;
    const name = checkForExistence(cell.querySelector('.talent-title'));
    const elite =
      eliteImage && eliteImage.getAttribute('src')?.includes('2.png')
        ? 'E2'
        : 'E1';
    const potent =
      potential && loc ? potential!.getAttribute('src')![loc - 1] : '1';
    const description = checkForExistence(
      cell.querySelector('.talent-description'),
    );
    return {
      elite: elite,
      potential: potent,
      talentName: name,
      description: description,
    };
  });

  const skillsTabs = operators
    .querySelectorAll('.skill-cell')
    .map((skill, i) => {
      const name = skill.querySelector('.skill-title-cell a:last-child');
      const rangeBoxes = skill.querySelectorAll('.skill-range-box .range-box');
      const skillRanges = rangeBoxes.map((boxes) => {
        const currCells = boxes.querySelectorAll('.range-cell');
        const range = Array.from(currCells).map((cell) => {
          const blocks = Array.from(cell.querySelectorAll('span')).map(
            (block) =>
              block.classList.contains('empty-box')
                ? 'attackable'
                : block.classList.contains('fill-box')
                ? 'unit'
                : 'null',
          );
          return blocks;
        });
        return range;
      });
      return {
        name: name.rawText.replace(/\n/g, ''),
        variations: Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
          return {
            level: i < 8 ? i : i === 8 ? 'M1' : i === 9 ? 'M2' : 'M3',
            description: checkForExistence(
              skill.querySelector(
                `.skill-description > .skill-upgrade-tab-${i}`,
              ),
            ),
            sp_cost: checkForExistence(
              skill.querySelector(`.sp-cost> .skill-upgrade-tab-${i}`),
            ),
            initial_sp: checkForExistence(
              skill.querySelector(`.initial-sp> .skill-upgrade-tab-${i}`),
            ),
            duration: checkForExistence(
              skill.querySelector(`.skill-duration> .skill-upgrade-tab-${i}`),
            ),
            range: skillRanges[i]
              ? skillRanges[i]
              : 'Skill does not modify range',
          };
        }),
        skill_charge: skill
          .querySelector('.sp-charge-type a')
          .rawText.replace(/\n/g, ''),
        skill_activation: skill
          .querySelector('.skill-activation a')
          .rawText.replace(/\n/g, ''),
      };
    });

  const modules: [{ [key: string]: any }] = [{}];
  for (let i = 1; i <= 3; i++) {
    const modulo = operators.querySelectorAll(
      `.operator-page-cell > .views-element-container .module-group-lvl-${i}`,
    );
    modulo.forEach((modulos) => {
      const moduleName = modulos.querySelector('.module-title a').rawText;
      const moduleAttribute = {};
      const moduleAttributeNames = modulos
        .querySelectorAll('.module-row-3 > table tr > th')
        .slice(2)
        .map((moduleAttributeName) => moduleAttributeName.rawText);
      const moduleAttributeValues = modulos
        .querySelectorAll('.module-row-3 > table tr > td')
        .map((moduleAttributeValue) => moduleAttributeValue.rawText);
      moduleAttributeNames.forEach(
        (moduleAttributeName, i) =>
          (moduleAttribute[moduleAttributeName] = moduleAttributeValues[i]),
      );
      const talent = modulos
        .querySelectorAll('.paragraph--type--module-talent-attributes')
        .map((cell) => {
          const elitePotImages = cell.querySelectorAll(
            '.module-unlock-phase img',
          );
          let loc = elitePotImages[1]?.getAttribute('src')?.indexOf('.png');
          while (elitePotImages[1].getAttribute('src')[loc - 2] !== '/')
            loc -= 1;
          return {
            name: checkForExistence(
              cell.querySelector('.module-talent-name a'),
            ),
            value: checkForExistence(
              cell.querySelector('.module-talent-row-2'),
            ),
            elite:
              elitePotImages[0] &&
              elitePotImages[0].getAttribute('src')?.includes('2.png')
                ? 'E2'
                : 'E1',
            potential:
              elitePotImages[1] && loc
                ? elitePotImages[1].getAttribute('src')[loc - 1]
                : '0',
            module_level: i,
          };
        });
      const unlockCriteria = [
        ...new Set(
          modulos
            .querySelectorAll(
              '.accordion-custom-content:last-child > table:nth-child(2) > tr',
            )
            .map((criteria, i) => {
              if (i > 0) return criteria.rawText.replace(/\n/g, '');
            })
            .filter(Boolean),
        ),
      ];
      const moduleData = {
        level: i,
        trait:
          modulos.querySelector('.module-row-2') === null
            ? ''
            : modulos
                .querySelector('.module-row-2')
                .rawText.replace(/\n|Equip Trait/g, ''),
        attributes: moduleAttribute,
        talent_changes: talent,
        unlock: unlockCriteria,
      };
      const existingModuleIndex = modules.findIndex(
        (moduler) => moduler.name === moduleName,
      );
      if (existingModuleIndex !== -1) {
        modules[existingModuleIndex].levels.push(moduleData);
      } else {
        if (!modules[0].name) modules.pop();
        modules.push({
          name: moduleName,
          trust: modulos
            .querySelector('.module-trust')
            .rawText.replace(/\n/g, ''),
          availability: modulos
            .querySelector('.module-availability')
            .rawText.replace(/\n/g, ''),
          levels: [moduleData],
        });
      }
    });
  }

  const base = operators.querySelectorAll('.building-buff-cell').map((el) => {
    const name = el.querySelector('.title-cell').rawText;
    const level = el
      .querySelector('.level-cell img[src]')
      ?.getAttribute('src')?.[41]
      ? `Elite ${
          el.querySelector('.level-cell img[src]').getAttribute('src')[41]
        }`
      : '';
    const effects = el
      .querySelector('.build-description-cell')
      .rawText.replace(/\n/g, '');
    const building = el
      .querySelector('.buff-type-cell')
      .rawText.replace(/\n/g, '');
    return { name, level, effects, building };
  });

  const characterInfo = {};
  const infoKeys = operators
    .querySelectorAll(
      '.profile-info-table > table:nth-child(2) th, .profile-info-table > table:nth-child(4) th',
    )
    .map((th) => th.rawText.replaceAll(' ', '_').toLowerCase());
  const infoBody = operators
    .querySelectorAll(
      '.profile-info-table > table:nth-child(2) td, .profile-info-table > table:nth-child(4) td',
    )
    .map((td) => td.rawText.replace(/\n/g, ''));
  infoKeys.forEach((key, i) => (characterInfo[key] = infoBody[i]));
  if (!characterInfo.hasOwnProperty('height'))
    characterInfo['Height'] = 'No Known Height';

  const affiliations = operators
    .querySelectorAll('.group-name > a')
    ?.map((affiliation) => affiliation.rawText.replace(/\n/g, ''));

  const voiceLines = {};
  const voiceLineConditions = operators
    .querySelectorAll('.voice-lines-table th')
    .map((th) => th.rawText.replaceAll(' ', '_').toLowerCase());
  const voiceLinesContent = operators
    .querySelectorAll('.voice-lines-table td')
    .map((td) => td.rawText.replace(/\n/g, ''));
  voiceLineConditions.forEach(
    (voiceLineConditions, i) =>
      (voiceLines[voiceLineConditions] = voiceLinesContent[i]),
  );

  const imgLinkList = operators
    .querySelectorAll('.operator-image > a')
    .map((a) => a.getAttribute('href'));
  const operatorArt: Array<{ name: string; link: string }> = [];
  operatorArt.push({ name: 'Base', link: imgLinkList[0] });
  operatorArt.push({ name: 'E1', link: imgLinkList[1] });
  operatorArt.push({ name: 'E2', link: imgLinkList[2] });
  const jpva =
    operators.querySelector(
      '.profile-info-table > table > tr:nth-child(2) > td > a',
    ) != null
      ? operators
          .querySelector(
            '.profile-info-table > table > tr:nth-child(2) > td > a',
          )
          .textContent.replace(/\n/g, '')
      : 'not have jp VA';
  const stat = await getStat(url);
  const cost = await getCosts(url);

  const op = new Operators();
  op.opId = url.replace('https://gamepress.gg/arknights/operator/', '');
  op.name = operatorName;
  op.alter = alter;
  op.affiliation = affiliations;
  op.art = operatorArt;
  op.availability = availability[1].textContent
    .replace(/\n/g, '')
    .replace(/&nbsp/g, ' ')
    .includes('N/A')
    ? 'CN only'
    : 'Global';
  op.Limited = JSON.parse(obtainable[1]);
  op.baseskill = base;
  op.biography = biography;
  op.class = clas;
  op.costs = cost;
  op.description = descriptionArr[1] as unknown as string;
  op.headhunting = JSON.parse(obtainable[0]);
  op.lore = characterInfo;
  op.module = modules;
  op.potential = potential;
  op.quote = descriptionArr[2] as unknown as string;
  op.range = cells;
  op.rarity = rarity;
  op.recruitable = JSON.parse(obtainable[2]);
  op.release_dates = releaseDates;
  op.skills = skillsTabs;
  op.statistics = stat;
  op.tags = tag;
  op.talents = talent;
  op.trait = descriptionArr[0] as unknown as string;
  op.trust = trust;
  op.url = url;
  op.voicelines = voiceLines;
  op.va = jpva;
  op.attack_type = attackType;
  op.faction = faction;

  return op;
};
function checkForExistence(field: any): string {
  if (!field || !field.textContent) {
    return 'Not provided';
  }
  const cleanedField = field.textContent
    .replace(/\n/g, '')
    .replace(/&nbsp/g, ' ');
  return cleanedField;
}
