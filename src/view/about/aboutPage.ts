import './aboutPage.css';

import rssSVG from '../../../assets/rs_school.svg';
import githubSVG from '../../../assets/github.svg';
import arkadiiImage from '../../../assets/arkadii.png';
import larisaImage from '../../../assets/larisa.png';
import ekaterinaImage from '../../../assets/ekaterina.jpg';

import { Page } from '../../framework/ui_components/page';
import { htmlComponents } from '../shared/htmlComponents';
import { blankLayout } from '../shared/layouts/blankLayout';

const { p, h1, h2, h3, div, img, ul, li, iconSvg, a, span } = htmlComponents;

const memberDescription = (
  imageUrl: string | undefined,
  name: string,
  role: string,
  description: string,
  actions: string[],
  github: string
) =>
  div(
    div(
      imageUrl ? img(imageUrl).cls('image') : div().cls('image'),
      h2(name),
      h3(role)
    ).cls('head'),
    div(description).cls('description'),
    ul(...actions.map((v) => li(v))),
    div(a(github, iconSvg(githubSVG).cls('icon'), span('GitHub'))).cls('github')
  ).cls('member-description');

export const aboutPage = new Page(() => {
  return blankLayout(
    div(
      div(
        h1('About Us'),
        p(
          'Our team of three novice frontend developers has created their own online flower shop. '
        ),
        p(
          'We carefully thought out the design of the website to make it bright and appealing to our customers. '
        ),
        p(
          'We also paid special attention to the usability of the site to make buying flowers easy and enjoyable. '
        ),
        p('We are proud of our work and the product we have created.')
      ).cls('description'),

      div(a('https://rollingscopes.com/', iconSvg(rssSVG))).cls('rss'),

      div(
        memberDescription(
          arkadiiImage,
          'Arkadii Semenov',
          'Team Lead',
          'Currently studying on the 2nd year in university Metropolitan in Belgrade with specialization "Software Engineering" and maximum completion grades for all the subjects.',
          [
            'Created the code implementation for the project.',
            'Implemented integrations with the commercetools API.',
            'Organized project structure and workflow.',
          ],
          'https://github.com/sem0ark'
        ),
        memberDescription(
          larisaImage,
          'Larisa Novozhilova',
          'Frontend Developer',
          'I am very interested in starting my career as a web developer. Currently, I am undergoing training at the RS School Front-end course, where I am delving into the fundamentals of front-end development. ',
          [
            'Created prototypes and design for the project.',
            'Actively participated in project discussions.',
            'Was in charge of final testing of the application.',
          ],
          'https://github.com/laranu'
        ),
        memberDescription(
          ekaterinaImage,
          'Ekaterina Grigoreva',
          'Frontend Developer',
          'Passionate about web development with a focus on creating intuitive and user-friendly interfaces. I am currently enhancing my skills through various projects and courses.',
          [
            'Was in charge of information collection regarding the requirements and API functionality.',
            'Actively participated in project discussions.',
            'Was in charge of final testing of the application.',
          ],
          'https://github.com/katiegrigoreva'
        )
      ).cls('members')
    ).cls('about-page')
  );
});
