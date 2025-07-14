

<img width="3768" height="1830" alt="Screenshot 2025-07-14 231637" src="https://github.com/user-attachments/assets/8cb5ecc5-404f-4ea3-ba9a-c48185323ca0" />


# Welcome to Dreamers!

npx shadcn-ui@latest init  # Setup Tailwind config
npx shadcn-ui@latest add button  # Add components as needed

This gives you customizable, accessible React components (like <Button>) that live in your code—no npm dependencies. Simply import from @/components/ui and tweak styles directly. See the code....


- This is a shareholders registration and share information management app. Below is the file structure of this app.


## node_modules

Automatically generated folder containing all external libraries and dependencies used in the project. Not meant to be edited.

## public

Contains static assets like images, fonts, and other files that are served directly without processing. Available at the root URL (e.g. /logo.png)

## .eslint.cjs

Configuration file for ESLint, which defines rules and settings for code quality and style checking. Uses commonJS format.

## .gitignore

Lists files and folders Git should ignore (not track), such as node_modules/, build outputs, and environment files.

## postcss.config.js

Configuration file for POSTCSS, used to transform CSS (e.g. autoPrefixing, minification) through plugins during build process.

## components.json

Configuration file for shadcn/ui that defines styling, Tailwind setup, file paths, and aliases used when generating and managing UI components.

## package-lock.json

An automatically generated file that records the exact versions of all installed Node.js packages(and their dependencies) used in the project. It ensures consistent installs across different environments.

## package.json

Defines the project's metadata, scripts and dependencies. It lists the required packages, their versions and scripts for running, building or testing the app. Acts as the main configuration file for node.js projects.

## tsconfig.json

Configuration file for typescript that specifies compiler options, file paths and rules for how typescript should process and compile the code. Helps ensure type safety and consistent development behavior.

## README.md

Main documentation file for the project. Provides and overview, setup instructions and usage guidelines. Useful for developers to understand and contribute to the project.

## tailwind.config.ts

Configuration file for tailwind CSS. Defines custom themes, colors, breakpoints and plugin settings. Written in Typescript for better type safety and editor support.

## vite.config.ts

Configuration file for vite, used as a development server and build tool instead of the default Remix compiler. Defines settings like plugins, aliases and environment variables. Chosen for its faster builds, better hot reloading and modern developer experience.


## app

The core application folder in the project. Contains routes, components, styles, and other logic. Follows Remix's file-based routing system, where files inside app/routes define the pages and API endpoints of the app. Contents of the app/ are as follows:


### components

A directory containing ui/ directory and custom built components.
ui/ directory contains reusable ui components added from shadcn/ui and used throughout the app.
All custom built components which are not API endpoints or routes are organized here. It mainly contains layout parts from page-specific code.

### lib

Contains utility functions, helper modules and share logic that supports the app's features. Data fetching, formatting, validations and other reusable non-UI logic are organized here.

### routes

Contains route files that define the app's pages and API endpoints. Each file corresponds to a URL path based on Remix's file-based routing system. Routes handle loading data, rendering UI, and server-side actions.

### tailwind.css

The main CSS file that includes Tailwind's base, components and utilities layers. Custom styles and overrides are added here. Imported into the app to apply tailwind CSS styling globally.

### entry.client.tsx

The client-side entry point for a remix application. It initializes the react app in the browser and handles client-side hydration and rendering. Required for enabling interactivity after server-side rendering.

### entry.server.tsx

The server-side entry point for a Remix application. It defines how the app is rendered on the server. Responsible for generating the initial HTML sent to the client.
