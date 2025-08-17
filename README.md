# Addressbook App

> **Demo / Current Outcome**: https://www.loom.com/share/6e38d924c83046d8abf150bc5d4e9861

## Overview
A simple, type-safe React application for creating and managing a personal address book. This update completes **all outstanding TODOs**, refreshes the design, improves responsiveness, adds tests, and clarifies installation & run scripts.

### What’s new in this update
- ✅ **All TODOs completed** (see the checklist below).
- 🎨 **Design refresh**: clearer visual hierarchy and spacing; polished button variants.
- 📱 **Responsive layout**: improved small-screen experience and fluid typography.
- 📍 **Address listing view updated**: cleaner cards/table layout with better scanning and empty states.
- 🧪 **Additional test cases**: coverage for hooks, form validation, Redux actions/reducers, and API logic.
- 🤖 **AI-assisted improvements**: used AI tools to help refine code structure and accelerate writing of unit tests.

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation
```bash
# 1) Install dependencies
npm install

# 2) Start the dev server
npm run dev
```

### Available Scripts
```bash
# Start development server (recommended)
npm start

# Run tests (unit/integration depending on project config)
npm run test

# Optional: type-check, lint, build (only if configured)
npm run type-check
npm run lint
npm run build
```
---

## How it works
Watch the short walkthrough: https://www.loom.com/share/6e38d924c83046d8abf150bc5d4e9861

- Users can **find an address** by entering *house number* and *postcode*.
- The app fetches and displays **matching addresses**.
- Users can **add personal info** to an address and save it to their address book.
- Duplicate prevention and deletion of saved addresses are supported.

---

## Completed TODOs

### Styling
- [x] Add the **Roboto** font from Google Fonts and expose it as a global CSS var `--font-primary`.
- [x] Improve **responsiveness**, especially on smaller screens.
- [x] Create separate styles for **.primary** and **.secondary** button variants using the brand color `#413ef7`.

### React
- [x] Write a **custom hook** for generic form field state management.
- [x] **Fetch addresses** based on `houseNumber` and `postCode` without adding new dependencies.
- [x] Create a **generic `<Form />`** component to render rows, legend, and submit button.
- [x] Create an **`<ErrorMessage />`** component for error display.
- [x] Add a **Clear** button to reset all form fields with a distinct, non-primary style.
- [x] Add **conditional classNames** for `primary`/`secondary` variants in `<Button />`.
- [x] Ensure **form validations** are applied in both "Find an Address" and "Add Personal Info" flows.

### TypeScript
- [x] **Refactor** the `extraProps` type in `<Form />` to correctly cover supported input props.
- [x] Define a **`ButtonType`** in `src/types/button` containing only valid HTML button types.

### Redux
- [x] **Prevent duplicate addresses** from being added to the state.
- [x] Implement a **remove** state update to delete an address from the array.

### Bonus
- [x] Refactor `pages/api/getAddresses` to **remove duplicated logic** for street number and postcode digit checking.

---

## Architecture & Notes
- **UI components**: Button (primary/secondary), Form, ErrorMessage, AddressCard/List.
- **State management**: Redux slice for addresses with add/remove and duplicate guarding.
- **Custom hooks**: e.g., `useFormFields` for controlled inputs and validation hooks.
- **API**: Internal route for address lookup with input normalization and guardrails.
- **Styling**: CSS variables for theme tokens; mobile-first responsive rules.

> **AI tools usage**: AI assistants were leveraged to suggest modular patterns, refine types, and draft initial unit tests that were then reviewed and adapted.

---

## Testing
Run the complete test suite:
```bash
npm run test
```
Coverage focuses on:
- Custom hooks behavior and edge cases
- Form validation and error messaging
- Redux actions/reducers (add, remove, duplicate prevention)
- API normalization and validation logic
