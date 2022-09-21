# Simple ATM controller

### Envrionment
- NodeJS >= 16.16.0
- Typescript >= 4.8.3

### Script
- run demonstration: `npm run demo`
- run demonstration with docker `npm run docker:build && npm run docker:run`
- test: `npm run test`
- compile to JS: `npm run compile`
- build to distribute: `npm run build`

### Description

Simple ATM controller does
 1) Start ATM session when a card inserted
 2) Take a PIN from user and get it verified by Bank API
 3) Do check balance, deposit, or withdraw

An account can have multiple cards linked while a card can be linked to a single account.
Thus, user does not select an account when he/she inserts a card.
