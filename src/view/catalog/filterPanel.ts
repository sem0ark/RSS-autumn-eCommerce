import './filterPanel.css';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { textComponents } from '../shared/textComponents';
import { catalogContext } from '../../contexts/catalogContext';
import { getId } from '../../framework/utilities/id';

const { div, p } = htmlComponents;
const { checkboxInput, labelled } = inputComponents;
const { header3Orange } = textComponents;

const initFilters = () => {
  catalogContext.filters.get().filters ||= { color: [], price: [] };
};

const priceSelection = () => {
  const checkboxPrice = (interval: [number, number]) =>
    checkboxInput().onInput((e) => {
      const checked = (e.target as HTMLInputElement).checked;
      initFilters();

      const filters = catalogContext.filters.get().filters;
      if (!filters) return;

      if (!checked) filters.price = filters.price.filter((v) => v !== interval);
      else filters.price = [...filters.price, interval];

      catalogContext.newRequest();
    });

  return div(
    p('Price:'),
    labelled('0-10', checkboxPrice([0, 1000]), getId('checkbox-price'), {
      reverseOrder: true,
    }),
    labelled('10-25', checkboxPrice([1000, 2500]), getId('checkbox-price'), {
      reverseOrder: true,
    }),
    labelled('25-50', checkboxPrice([2500, 5000]), getId('checkbox-price'), {
      reverseOrder: true,
    }),
    labelled('50-100', checkboxPrice([5000, 10000]), getId('checkbox-price'), {
      reverseOrder: true,
    }),
    labelled(
      '100-250',
      checkboxPrice([10000, 25000]),
      getId('checkbox-price'),
      { reverseOrder: true }
    ),
    labelled('250+', checkboxPrice([25000, 0]), getId('checkbox-price'), {
      reverseOrder: true,
    })
  ).cls('filter-block');
};

const colorSelection = () => {
  const checkboxColor = (color: string) =>
    checkboxInput().onInput((e) => {
      const checked = (e.target as HTMLInputElement).checked;
      initFilters();

      const filters = catalogContext.filters.get().filters;
      if (!filters) return;

      if (!checked) filters.color = filters.color.filter((v) => v !== color);
      else filters.color = [...filters.color, color];

      catalogContext.newRequest();
    });

  return div(
    p('Color:'),
    labelled('Red', checkboxColor('red'), getId('checkbox-color'), {
      reverseOrder: true,
    }),
    labelled('Blue', checkboxColor('blue'), getId('checkbox-color'), {
      reverseOrder: true,
    }),
    labelled('Yellow', checkboxColor('yellow'), getId('checkbox-color'), {
      reverseOrder: true,
    }),
    labelled('White', checkboxColor('white'), getId('checkbox-color'), {
      reverseOrder: true,
    })
  ).cls('filter-block');
};

export const filterPanel = () => {
  return div(header3Orange('Filter'), priceSelection(), colorSelection()).cls(
    'filter-panel'
  );
};
