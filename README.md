# Excuse Generator with Modus

This project uses AssemblyScript and the [Modus](https://docs.hypermode.com/modus/overview) SDK to generate creative and humorous excuses.

## Prerequisites -

for latest see modus [quick start](https://docs.hypermode.com/modus/quickstart#prerequisites)

- Node.js - v22 or higher
- Text editor - we recommend VS Code
- Terminal - access Modus through a command-line interface (CLI)
  ​

## Create a new modus project

Follow the instructions [here](https://docs.hypermode.com/modus/quickstart#building-your-first-modus-app)

## Setup

1. **Clone the repository:**

   you're on github I'm sure you know how to clone the repo

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or yarn:

   ```bash
   yarn install
   ```

3. **Run the application:**

   you can install @hypermode/modus-cli globally:

   ```bash
   npm install -g @hypermode/modus-cli
   ```

   or locally:

   ```bash
   npm install @hypermode/modus-cli
   ```

   and then run with npx after cloning the repo:

   ```bash
   npx modus dev
   ```

4. **Sample Response:**

````json
{
  "status": 200,
  "headers": {
    "Vary": "Origin",
    "Content-Length": "1040",
    "Date": "Thu, 28 Nov 2024 10:23:58 GMT",
    "Content-Type": "application/json"
  },
  "body": {
    "data": {
      "generateExcuses": "```json\n[\n \"I must regretfully decline your YALDA invitation because I have entered into an exclusive, long-term contract with a secret society of vampire librarians. They need me to translate their ancient scrolls into modern emojis, and it turns out the longest night of the year is when they get the most 'lit'. My absence would surely result in a catastrophic, apocalyptic reading room riot, and nobody wants that kind of chaos over a fruit platter, right?\",\n \n \"Unfortunately, I won’t be able to attend YALDA this time as I am on a quest to recover my stolen shadow from a league of interdimensional narwhals. Somehow, they’ve mistaken it for the mythical 'Night-Sparkle Luminance' which they intend to use to overthrow Neptune's throne. I’m afraid dealing with a potential cosmic marine monarchy crisis takes precedence over munching on watermelon, though I hear the seeds are quite tasty.\"\n]\n```"
    },
    "extensions": {
      "invocations": {
        "generateExcuses": {
          "executionId": "ct449e3s4hmi2mc1a5gg"
        }
      }
    }
  },
  "reason": "OK"
}
````
