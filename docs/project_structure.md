# Project structure

## Folder structure
- `data` - for classes representing connections to the outer dependencies, such as API or a database.
- `contexts` - for classes representing business logic of the application, providing interaction handles and reactive properties for the UI.
- `framework` - for code of a reusable library, used for the project implementation: reactive properties, UI components, UI - context interaction means.
- `loaders` - for code assembling and starting the application.
- `utils` - for algorithms and utility functions used in the application.
- `view` - for actual UI components of the application grouped by page (type) and their related styles
