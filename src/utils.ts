const axios = require('axios');
const cheerio = require('cheerio');
const { prompt } = require('inquirer');
const fs = require('fs');

// List of error messages
export const ERROR = {
  MISSING_TOKEN_FILE: `Unable to find your .genius_token.json file.`,
};

// Load the token for the user
const getToken = () => {
  try {
    const creds = fs.readFileSync(process.cwd() + '/.genius_token.json', 'utf8');
    return JSON.parse(creds).access_token;
  } catch (err) {
    console.error(ERROR.MISSING_TOKEN_FILE);
    process.exit(1);
  }
};

// Gets the lyrics given the url of a song
export const findLyrics = async (url: any) => {
    try {
      const response = await axios({
        method: 'get',
        url,
      });
      const $ = await cheerio.load(String(response.data));
      const lyrics = $('div[class="lyrics"]');
      console.log(lyrics.text());
    } catch (error) {
      console.error(error);
    }
};

// Finds the url of a song based on its ID and then gets
// the lyrics
export const findSong = async (id: any) => {
    const url = `https://api.genius.com/songs/${id}`;
    try {
      const { data } = await axios({
        method: 'get',
        url,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      findLyrics(data.response.song.url);
    } catch (error) {
      console.error(error);
    }
};

// Shows top 10 song results from a general search
export const songSearcher = async (q: string) => {
    const url = `https://api.genius.com/search?q=${q}`;
    try {
        const { data } = await axios({
            method: 'get',
            url,
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
        });
        const results = new Array();
        data.response.hits.forEach((element: any) => {
          results.push({
            name: `${element.result.title} - ${element.result.primary_artist.name}`,
            value: element.result.id,
          });
        });
        await prompt([{
            name: 'id',
            type: 'list',
            choices: results,
            message: 'Choose a song',
        }]).then((answers: any) => {
            findSong(answers.id);
        }).catch((err: any) => {
            console.log(err);
        });
    } catch (error) {
        console.error(error);
    }
};