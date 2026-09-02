# Phase 4 — Import Error UI

Goal: replace the two import `alert()` error paths with a visible, accessible in-app error message without changing the import data flow.

Required behavior:
- malformed JSON must leave the current data untouched and show a visible error;
- an unrecognized backup must leave the current data untouched and show a visible error;
- successful imports keep the existing confirmation and persistence behavior;
- no imported text is inserted as HTML;
- error output should use text content only;
- the message must be dismissible and keyboard/focus accessible.

Implementation constraint:
- change only the import UI path in `app.js` plus the minimum HTML/CSS needed;
- preserve existing explanatory comments, translating only comments touched by the change;
- increment `sw.js` VERSION because `index.html`/`app.js` changes affect cached application code;
- run `node werkzeug/pruefen.mjs` and the existing browser suites after each functional step.

Current status: guard exists on `feature/import-error-message-check`; the product UI change is intentionally not claimed complete until the existing `app.js` and `index.html` content can be updated without reconstructing/overwriting unrelated file bytes.
