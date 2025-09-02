


# GameStates Rules

In the game state from storage.js save a config that set the default loading rules. The values are
- config.nCards = 5
- config.defaultStart = 0
- config.defaultEnd = 100

## Useing config defaults
- Use the config defaults to call `createRandomNumberGenerator` on load of document.
- Use then use the output from createRandomNumberGenerator to set the array of cards state in storage.js
- Finally onload ALWAYS read from cards first. if cards are present you MUST skip `createRandomNumberGenerator`'s call. Add this logic into app.js

