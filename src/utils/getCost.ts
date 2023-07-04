import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
const BASE = 'https://gamepress.gg/';

export const getCosts = async (
  url,
): Promise<{ icon: string; name: string; amount: number }[]> => {
  const itemRes = await fetch(
    'https://raw.githubusercontent.com/wesngu28/rhodesapi/main/util/itemMapping.json',
  );
  const itemMap = await itemRes.json();
  const response = await fetch(url);
  const text = await response.text();
  const html = parse(text);
  let costList = [];
  const onetoseven = html.querySelectorAll('.skill-material-cost17 a');
  const onetosevenqty = html.querySelectorAll(
    '.skill-material-cost17 .material-quantity',
  );
  costList = await getItemsAndQuantity(costList, onetoseven, onetosevenqty);
  const m1tom3 = html.querySelectorAll('.skill-material-cost810 a');
  const m1tom3qty = html.querySelectorAll(
    '.skill-material-cost810 .material-quantity',
  );
  costList = await getItemsAndQuantity(costList, m1tom3, m1tom3qty);
  const rankcost = html.querySelectorAll('.table-3 a');
  const rankcostqty = html.querySelectorAll('.table-3 .material-quantity');
  costList = await getItemsAndQuantity(costList, rankcost, rankcostqty);
  const newKeys = [];
  for (let i = 0; i < Object.keys(costList).length; i++) {
    if (Object.values(itemMap).includes(Object.values(costList)[i].name)) {
      const matchingKey = Object.keys(itemMap).find(
        (key) => itemMap[key] === Object.values(costList)[i].name,
      );
      newKeys.push(matchingKey);
    } else {
      const test = await fetch(costList[i].name);
      const text = await test.text();
      const html = parse(text);
      const name = html.querySelector('#page-title > h1').text;
      newKeys.push(name);
    }
  }
  Object.keys(costList).forEach((key, idx) => {
    costList[idx].name = newKeys[idx];
  });
  return costList;
};

async function getItemsAndQuantity(masterList, itemList, qtyList) {
  for (let index = 0; index < itemList.length; index++) {
    const newElement = BASE + itemList[index].getAttribute('href');
    if (
      masterList.length === 0 ||
      !masterList.some((obj) => obj.name === newElement)
    ) {
      // const test = await fetch(newElement);
      // const text = await test.text();
      // const html = parse(text);
      // const itemIcon = html
      //   .querySelector('.item-icon-cell img')
      //   .getAttribute('src');
      masterList.push({
        //icon: itemIcon,
        name: newElement,
        amount: Number(qtyList[index].text.replace('x', '')),
      });
    } else {
      const objIndex = masterList.findIndex((obj) => obj.name === newElement);
      masterList[objIndex].amount += Number(
        qtyList[index].text.replace('x', ''),
      );
    }
  }
  return masterList;
}
