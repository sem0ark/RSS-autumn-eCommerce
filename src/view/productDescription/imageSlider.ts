import './imageSlider.css';

import { factories } from '../../framework/factories';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { spinnerComponents } from '../shared/spinnerComponents';
import {
  PBoolean,
  PInteger,
} from '../../framework/reactive_properties/property';
import { containerComponents } from '../shared/containerComponents';

const { pinteger, asynchronous, pboolean } = factories;
const { div, img, hidden } = htmlComponents;
const { spinner } = spinnerComponents;
const { buttonSecondary } = inputComponents;
const { containerModalCenter } = containerComponents;

const image = (url: string, i: number, index: PInteger, modalOpen: PBoolean) =>
  asynchronous(
    async () => {
      return new Promise((res) => {
        const imageElement = new Image();
        imageElement.src = url;
        imageElement.onload = () =>
          res(
            img(url)
              .cls('image', 'block-selection')
              .onClick(() => modalOpen.toggle(), true, true)
              .propClass(index, (ind) => (ind === i ? ['active'] : []))
          );
      });
    },
    () =>
      spinner()
        .cls('image')
        .propClass(index, (ind) => (ind === i ? ['active'] : []))
  );

function repeater(cb: () => void, ms: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow usage of timeouts
  let timeout: any;

  const updateTimeout = () => {
    cb();
    timeout = setTimeout(updateTimeout, ms);
  };

  const cancel = () => {
    clearTimeout(timeout);
    timeout = setTimeout(updateTimeout, ms);
  };

  timeout = setTimeout(updateTimeout, ms);

  return cancel;
}

const sliderElement = (imageUrls: string[], modalOpen: PBoolean) => {
  const index = pinteger(0);
  const totalImages = imageUrls.length;

  const cancel = repeater(() => {
    index.set((index.get() + 1 + totalImages) % totalImages);
  }, 5000);

  const inc = () => {
    index.set((index.get() + 1 + totalImages) % totalImages);
    cancel();
  };

  const dec = () => {
    index.set((index.get() - 1 + totalImages) % totalImages);
    cancel();
  };

  const slider = div(
    imageUrls.length > 1 ? buttonSecondary('←').onClick(dec) : hidden(),
    ...imageUrls.map((url, i) => image(url, i, index, modalOpen)),

    imageUrls.length > 1
      ? div(
          ...imageUrls.map((_, i) =>
            div()
              .cls('dot')
              .propClass(index, (ind) => (ind === i ? ['active'] : []))
              .onClick(() => {
                cancel();
                index.set(i);
              })
          )
        ).cls('dot-container')
      : hidden(),

    imageUrls.length > 1 ? buttonSecondary('→').onClick(inc) : hidden()
  ).cls('slider-component');

  index.onChange((v) => slider.applyStyle('--i', `${v}`));

  return slider;
};

export const sliderComponent = (imageUrls: string[]) => {
  const modalOpen = pboolean(false);
  return div(
    sliderElement(imageUrls, modalOpen).propClass(modalOpen, (o) =>
      o ? ['hidden'] : []
    ),
    containerModalCenter(
      sliderElement(imageUrls, modalOpen),
      buttonSecondary('❌')
        .onClick(() => modalOpen.toggle())
        .cls('cancel')
    )
      .cls('slider-modal')
      .propClass(modalOpen, (o) => (o ? ['active'] : []))
  ).cls('slider-container');
};

// containerModalCenter(123).propClass(modalOpen, (o) => o ? ['active'] : [] );
