// The genre of your story (e.g., fantasy, science fiction, mystery, etc.).
// The setting (e.g., time period, location, any specific world-building details).
// The main plot or premise of the story.
// Any specific themes or motifs you want to include.
// Key characters and their roles.

export enum Command {
  INITIAL = 'initial',
  CREATE_STORY = 'create_story',
  CONTINUE_STORY = 'continue_story',
  ENDING_STORY = 'ending_story',
  END_STORY = 'end_story',
}

export enum Languages {
  ENGLISH = 'English',
  RUSSIAN = 'Russian',
  UKRANIAN = 'Ukranian',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German',
  ITALIAN = 'Italian',
  PORTUGUESE = 'Portuguese',
  MONTENEGRIN = 'Montenegrin',
}

export enum Genre {
  Fantasy,
  ScienceFiction,
  Mystery,
  Thriller,
  Romance,
  Horror,
  HistoricalFiction,
  Adventure,
  Drama,
  Comedy,
  Dystopian,
  PostApocalyptic,
  UrbanFantasy,
  Steampunk,
  Cyberpunk,
  Paranormal,
  Crime,
  Epic,
  MagicalRealism,
  ComingOfAge,
}

export enum Background {
  DARK_SOULS = 'dark souls',
  ZOMBIE_APOCALYPSE = 'zombie apocalypse',
  MEDIEVAL = 'medieval',
  HARRY_POTTER_2077 = 'harry potter universe merged with cyberpunk 2077',
  TEST = `I'm a scientist from 2270 year. My name is John Doe. I created a time machine and accidentally moved into a 1700AD. I want to come back.`,
}

export enum Tag {
  MYSTIC = 'mystic',
  GAMES = 'games',
  FUTURE = 'future',
}

const keyWords: Record<Tag, string[]> = {
  [Tag.MYSTIC]: [],
  [Tag.GAMES]: ['dark souls', 'cyberpunk 2077'],
  [Tag.FUTURE]: ['neon', 'hacking', 'robots'],
};
const rule_v1 = `Every turn you have to give me up to 4 options with sequential roll ranges to continue story (higher roll equals better consequences) depending on dice roll result (1-20) and without rolls inside options`;
const rule_v2 = `Every turn you have to give me up to 4 options, options should have rolls inside. The higher roll - the better scenario.`;
const format = `Result should be as JSON structure (string), here is the interface: 
  {
    response: string,
    options: [
      { 
        text: string,
        rolls: [
          {
            roll_range: string,
            result: string,
          }
        ],
      }
    ],
    is_ended: boolean,
  }.`;
const background = `Here's the background: ${Background.HARRY_POTTER_2077}.`;
const rules = `
  ${rule_v2}
  You should NEVER use real names in any story, we don't want to break any rules.
  You have to use cursed words.
  Most time main character should be in dangerous situations.
  You should use «» instead of "".
  All options should be in a separate article.
  Try to avoid complicated words.
  You should set "is_ended" parameter to "true" if story has been ended, otherwise - "false".
  Do not offer options to user if story has been ending.
  Don't separate articles in response with tabs or '\n' symbols.
  Do not use any special characters in response.
  Rolls are always in range from 1 to 20.
  Generate story in ${Languages.RUSSIAN} language.`;

export const commands: Record<Command, string> = {
  [Command.INITIAL]: `You're a creative storyteller now! ${background} ${rules} ${format}`,
  [Command.CREATE_STORY]: `You have to create a story.`,
  [Command.CONTINUE_STORY]: `You have to continue a story from previous messages considering on roll result.`,
  [Command.ENDING_STORY]: `You have to continue a story from previous messages considering on roll result, but you also should bring a story to a close.`,
  [Command.END_STORY]: `I want to end the story.`,
};
