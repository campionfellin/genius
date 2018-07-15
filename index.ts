#!/usr/bin/env node

/**
 * genius - the Genius CLI
 */

const commander = require('commander');
const { prompt } = require('inquirer');
import { findSong, songSearcher } from './src/utils';
const fs = require('fs');

// CLI

/**
 * Set global CLI configurations
 */
commander
  .usage(`<command> [options]`)
  .description(`genius - The Genius CLI`);

/**
 * Searches for a song.
 * @name search
 * @example search --title "hello"
 */
commander
  .command('search')
  .description('Search for a song')
  .option('--title <title>', 'Title of the song')
  .option('--artist <artist>', 'Artist for the song')
  .action(async (cmd: {
      title: string,
      artist: string,
  }) => {
    const q = cmd.artist ? `${cmd.title} - ${cmd.artist}` : cmd.title;
    songSearcher(q);
  });

/**
 * Gets the lyrics for a song.
 * @name lyrics
 * @example lyrics --id "1234"
 */
commander
.command('lyrics')
.description('Get the lyrics for a song')
.option('--id [id]', 'ID of the song')
.action((cmd: {
    id: string,
}) => {
  findSong(cmd.id);
});

/**
 * Logs into the Genius API
 * @name login
 * @example login
 */
commander
.command('login')
.description('Logs into the Genius API')
.action(async () => {
  let accessToken = '';
  await prompt([{
    type : 'input',
    name : 'access_token',
    message : 'What is your client access token? (https://genius.com/api-clients)',
  }]).then((answers: any) => {
    accessToken = answers.access_token;
    const accessFile = {
      access_token: accessToken,
    };
    fs.writeFileSync(process.cwd() + '/.genius_token.json', JSON.stringify(accessFile), 'utf8');
    console.log('Successfully logged in.');
  }).catch((err: any) => {
    console.log(err);
  });
});

/**
 * Logs out of the Genius API
 * @name logout
 * @example logout
 */
commander
.command('logout')
.description('Logs out of the Genius API')
.action(async () => {
  try {
    fs.unlinkSync(process.cwd() + '/.genius_token.json');
    console.log('Successfully logged out.');
  } catch (err) {
    console.log('File doesnt exist anyway.');
  }
});

/**
 * Displays the help function.
 * @name help
 * @example help
 */
commander
  .command('help')
  .description('Display help')
  .action(() => {
    commander.outputHelp();
  });

/**
 * Displays genius version
 */
commander
.version(require('./package.json').version, '-v, --version');

/**
 * All other commands are given a help message.
 * @example random
 */
commander
  .command('*', { isDefault: true })
  .description('Any other command is not supported')
  .action(() => {
      console.log('This function does not exist.');
  });

// defaults to help if commands are not provided
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}

// User input is provided from the process' arguments
commander.parse(process.argv);