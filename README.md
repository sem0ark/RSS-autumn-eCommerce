# RSS-autumn-eCommerce: Flower Store
The project was implemented as a final task for the 2nd stage of RS School Front-end development program (**JavaScript/Front-end 2023Q4**). eCommerce application for a **Flower Store** replicates real-world shopping experiences in a digital environment.

Participants:
1. Arkadii Semenov ([GitHub @sem0ark](https://github.com/sem0ark)); Mentor: Eugeniya Ivanova ([GitHub @enya1407](https://github.com/enya1407))
2. Ekaterina Grigoreva ([GitHub @katiegrigoreva](https://github.com/katiegrigoreva)); Mentor: Andrew Shamrey ([GitHub @AndrewShamrey](https://github.com/AndrewShamrey))
3. Larisa Novozhilova ([GitHub @laranu](https://github.com/laranu)); Mentor: ([GitHub @at-sky](https://github.com/at-sky))


## Contents
- Docs for development and contribution
  - [Project structure](./docs/project_structure.md)
  - [Framework description](./docs/framework.md)


## Description
*Project goal:* provide an interactive and seamless experience to users. From product discovery to checkout, the application ensures a smooth journey for the user. It includes features such as:
- user registration and login;
- product search;
- product categorization and sorting.


## Project Stack
Development:
1. TypeScript
2. Jest

Maintenance:
1. Prettier
2. ESLint
3. Husky (`commitilint` for conventional commits)

## Installation and scripts
To run the project locally, consider installing Node of version `20.11` or later:

```bash
# check out the repository
git clone https://github.com/sem0ark/RSS-autumn-eCommerce.git
cd ./RSS-autumn-eCommerce/

# install required NPM dependencies
npm install
# configure Husky for commit linting
npm run prepare
# try to run the available tests to make sure everything works fine
npm run test
```

We recommend you to check out the information about the [Project structure](./docs/project_structure.md) and summary of [project's framework functionality](./docs/framework.md).

### Scripts
In the `package.json` file you may see:
- `npm run dev` - run dev mode for vite, automatic reload
- `npm run build` - build project for production
- `npm run preview` - run built project in production environment
- `npm run lint` - run checks for style guidelines
- `npm run lint-fix` - run checks for style guidelines with automatic correction
- `npm run test` - run Jest tests locally
- `npm run prepare` - initialize Husky locally
- `npm run lint-ci-eslint` - run ESLint checks for GitHub Actions CI
- `npm run lint-ci-prettier` - run Prettier checks for GitHub Actions CI
- `npm run test-ci` - run Jest tests in GitHub Actions CI
