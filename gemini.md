# Gemini Agent Configuration

## Project Overview

This is a **Next.js** web application built with **React**. It serves as a comprehensive life-management and personal growth platform. The backend is powered by **Vercel Serverless Functions**, with **Xata Lite** as the primary database solution. User authentication is handled by **Auth0**.

## Key Technologies

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [React](https://react.dev/) (with React Compiler enabled)
- **Database**: [Xata Lite](https://lite.xata.io/docs)
- **Authentication**: [Auth0](https://auth0.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Real-time Communication**: [Pusher](https://pusher.com/docs/channels/getting_started/javascript/?ref=docs-index)
- **Styling**: [SCSS Modules](https://github.com/css-modules/css-modules)

## Architectural Principles

- **Modularity**: The project is organized into distinct modules for components, pages, server-side logic, and client-side scripts within the `/src` directory.
- **Path Aliases**: The project uses the `@/*` alias for the `/src/*` directory to simplify import paths.
- **Separation of Concerns**:
  - **API Endpoints**: All API routes are located in `/src/pages/api/`. Data mutation endpoints are specifically organized under `/src/pages/api/data/`.
  - **Database Logic**: All Xata-related database actions (CRUD operations) are encapsulated in dedicated modules within `/src/server/xata/`. This promotes reusability and testability.
  - **State Management**: Global state is managed by Zustand, with the store defined in `/src/store/useHDVisionStore.js`.
- **Styling**: Component-level styling is achieved using **SCSS Modules**, ensuring styles are locally scoped and preventing global conflicts. SCSS module filenames are imported into JSX as `sty`. SCSS naming conventions dictate that if a `div` element is styled, its class name should start with `.box__` followed by a descriptive term. If the element is not a `div`, the class name should start with the element's name, such as `input__` for an `input` element, using underscores `_` to separate words instead of camel case. Global styles are defined in `/src/styles/global.scss`. Unless explicitly allowed, global styles are avoided to prevent style pollution.
- **Scalability:** By utilizing Vercel Serverless Functions, the application is inherently scalable, capable of handling varying loads efficiently.
- **Maintainability:** Consistent conventions and encapsulated logic contribute to a highly maintainable codebase.

## Coding Standards

- **Language**: The project uses **JavaScript** exclusively. **TypeScript** is NOT used.
- **File Extensions**:
  - **React Components**: Must use `.jsx` extension (NOT `.js` or `.tsx`).
  - **Non-component logic**: Use `.js`.
