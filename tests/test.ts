import { expect } from 'chai';
import { describe, it } from 'mocha';
const { spawnSync } = require('child_process');
const sampleToken = process.env.TOKEN || '';

describe('Test genius login function', () => {
    it('should prompt for genius login', () => {
      const result = spawnSync(
        'genius', ['login'], { input: sampleToken, encoding: 'utf8' },
      );
      expect(result.stdout).to.contain('What is your client access token? (https://genius.com/api-clients)');
      expect(result.stdout).to.contain('Successfully logged in.');
    });
});

describe('Test genius lyrics --id function', () => {
    it('should show lyrics for song with id 1234', () => {
      const result = spawnSync(
        'genius', ['lyrics', '--id', '1234'], { encoding: 'utf8' },
      );
      expect(result.stdout).to.contain(`[Intro: Lil Wayne & T-Pain]
Yeah, yeah!
I need a Winn-Dixie grocery bag full of money  (whoo!)
Right now to the VIP section (whoo!)
You got Young Mula in the house tonight, baby (yeah!)
Yeah, haha, yeah, Young (ay-hey)
Young, Young, Young, Young Mula baby!`);
    });
});

describe('Test genius logout function', () => {
    it('should logout and remove token file', () => {
      const result = spawnSync(
        'genius', ['logout'], { encoding: 'utf8' },
      );
      expect(result.stdout).to.contain('Successfully logged out.');
    });
});

describe('Test genius functions without logged in', () => {
    it('give nice error about not being logged in', () => {
      const result = spawnSync(
        'genius', ['lyrics', '--id', '1234'], { encoding: 'utf8' },
      );
      expect(result.stderr).to.contain(`Unable to find your .genius_token.json file.`);
    });
    it('give nice error about not being logged in', () => {
        const result = spawnSync(
          'genius', ['search', '--title', 'hello'], { encoding: 'utf8' },
        );
        expect(result.stderr).to.contain(`Unable to find your .genius_token.json file.`);
    });
    it('give nice error about not being logged in', () => {
        const result = spawnSync(
          'genius', ['search', '--title', 'hello', '--artist', 'adele'], { encoding: 'utf8' },
        );
        expect(result.stderr).to.contain(`Unable to find your .genius_token.json file.`);
    });
    it('give nice error about not being logged in', () => {
        const result = spawnSync(
          'genius', ['search', '--artist', 'adele'], { encoding: 'utf8' },
        );
        expect(result.stderr).to.contain(`Unable to find your .genius_token.json file.`);
    });
});

describe('Test genius help function', () => {
    it('should display help', () => {
      const result = spawnSync(
        'genius', ['help'], { encoding: 'utf8' },
      );
      expect(result.stdout).to.contain(`Usage: genius <command> [options]`);
    });
    it('should display help', () => {
        const result = spawnSync(
          'genius', ['--help'], { encoding: 'utf8' },
        );
        expect(result.stdout).to.contain(`Usage: genius <command> [options]`);
    });
    it('should display help', () => {
        const result = spawnSync(
            'genius', ['-h'], { encoding: 'utf8' },
        );
        expect(result.stdout).to.contain(`Usage: genius <command> [options]`);
    });
});

describe('Test genius version function', () => {
    it('should display version', () => {
      const result = spawnSync(
        'genius', ['-v'], { encoding: 'utf8' },
      );
      expect(result.stdout).to.contain(require('./../package.json').version);
    });
    it('should display version', () => {
        const result = spawnSync(
          'genius', ['--version'], { encoding: 'utf8' },
        );
        expect(result.stdout).to.contain(require('./../package.json').version);
    });
});

describe('Test genius unknown function', () => {
    it('should display error unknown function', () => {
      const result = spawnSync(
        'genius', ['wrong'], { encoding: 'utf8' },
      );
      expect(result.stdout).to.contain('This function does not exist.');
    });
});