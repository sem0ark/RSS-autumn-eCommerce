import { factories } from '../../framework/factories';
import { Router } from '../../framework/routing/router';
import { CC } from '../../framework/ui_components/htmlComponent';

const { html, htmlTag } = factories;

const div = html('div');
const hidden = () =>
  div().style('display', 'none').style('height', '0px').style('width', '0px');
const tmp = () => div().cls('tmp');

const main = html('main');
const nav = html('nav');

const h1 = html('h1');
const h2 = html('h2');
const h3 = html('h3');
const h4 = html('h4');
const h5 = html('h5');
const h6 = html('h6');

const p = html('p');

const em = html('em');
const b = html('b');

const br = html('br');

const span = html('span');

const a = (url: string, ...children: CC) =>
  html('a')(...children)
    .cls('link', 'link-external')
    .attr('href', url);

const link = (url: string, ...children: CC) =>
  html('a')(...children)
    .cls('link', 'link-local')
    .attr('href', url)
    .on('click', () => Router.navigateTo(url), true);

const img = (url: string) => htmlTag('img').attr('src', url).cls('image');

const iconSvg = (url: string) => htmlTag('img').attr('src', url).cls('icon');
const svg = (innerHTML: string) =>
  htmlTag('svg').onRender((n) => (n.innerHTML = innerHTML));

const button = html('button');

const form = html('form');
const label = html('label');
const input = html('input');
const textArea = html('textarea');

const select = html('select');
const option = html('option');

// Tables
const table = html('table');
const thead = html('thead');
const tbody = html('tbody');
const tfoot = html('tfoot');

const tr = html('tr');
const th = html('th');
const td = html('td');

// Lists
const li = html('li');
const ol = html('ol');
const ul = html('ul');

export const htmlComponents = {
  a,
  link,
  p,
  div,
  span,
  button,
  main,
  nav,
  form,
  label,
  input,
  textArea,
  em,
  b,
  img,
  iconSvg,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  tmp,
  hidden,
  select,
  option,
  br,
  svg,
  table,
  thead,
  tbody,
  tfoot,
  tr,
  th,
  td,
  li,
  ol,
  ul,
};
