import {JSDOM} from "jsdom";
import got from "got";
import {Sense, Word} from "./Word";
import * as fs from "fs";

const WORDS = [
  "degree",
  "education",
  "entrance",
  "entry test",
  "fraternity",
  "gap year",
  "grade",
  "grant",
  "loan",
  "pecking order",
  "scholarship",
  "red brick universities",
  "scientist",
  "sorority",
  "subject",
  "tuition fees",
  "time off",
  "tutorial",
  "university",
  "applicant",
  "student",
  "postgraduate",
  "undergraduate",
  "session",
  "year",
  "graduate",
  "hall of residence",
  "dormitory",
  "scholar"
];

async function cambridge() {
  let words: Word[] = [];

  for (const word of WORDS) {
    const URL = `https://dictionary.cambridge.org/dictionary/english-russian/${word}`;
    let response = await got(URL);

    let dom = new JSDOM(response.body);

    let senses: Sense[] = [];

    dom.window.document.querySelectorAll("div.pr.entry-body__el")
      .forEach((div: Element) => {
        let wordClass = div.querySelector("span.pos")?.textContent ?? "";
        let guideWord = div.querySelector("span.guideword.dsense_gw")?.querySelector("span")?.textContent?.toLowerCase() ?? "";
        let description = div.querySelector("div.def.ddef_d.db")?.textContent ?? "";

        let sense: Sense = {
          guideWord: guideWord,
          description: description,
          wordClass: wordClass
        };
        senses.push(sense);
      });

    let _word: Word = {
      word: word,
      senses: senses
    };
    words.push(_word);
  }

  for (let word of words) {
    fs.appendFileSync("cambridge.md", `## ${word.word}\n\n`);
    console.log(word.word);
    for (let sense of word.senses) {
      let message = `* [__${sense.wordClass}__] ${sense.guideWord ? `(_${sense.guideWord}_)` : ""} ${sense.description}\n`;
      fs.appendFileSync("cambridge.md", message);
      console.log(message);
    }
    fs.appendFileSync("cambridge.md", `\n`);
  }
}

async function macmillan() {
  let words: Word[] = [];

  for (const word of WORDS) {
    const URL = `https://www.macmillandictionary.com/dictionary/british/${word}`;
    let response = await got(URL);

    let dom = new JSDOM(response.body);

    let senses: Sense[] = [];
    let wordClass = dom.window.document.querySelector("span.PART-OF-SPEECH")?.textContent?.replace(/\W/g, "").toLowerCase() ?? "";

    dom.window.document.querySelectorAll("div.SENSE-CONTENT")
      .forEach((div: Element) => {
        let description = div.querySelector("span.DEFINITION")?.textContent ?? "";

        let sense: Sense = {
          description: description,
          wordClass: wordClass
        };
        senses.push(sense);
      });

    let _word: Word = {
      word: word,
      senses: senses
    };
    words.push(_word);
  }

  for (let word of words) {
    fs.appendFileSync("macmillan.md", `## ${word.word}\n\n`);
    console.log(word.word);
    for (let sense of word.senses) {
      let message = `* [__${sense.wordClass}__] ${sense.guideWord ? `(_${sense.guideWord}_)` : ""} ${sense.description}\n`;
      fs.appendFileSync("macmillan.md", message);
      console.log(message);
    }
    fs.appendFileSync("macmillan.md", `\n`);
  }
}

async function merriam() {
  let words: Word[] = [];

  for (const word of WORDS) {
    try {
      const URL = `https://www.merriam-webster.com/dictionary/${word}`;
      let response = await got(URL);

      let dom = new JSDOM(response.body);

      let senses: Sense[] = [];

      dom.window.document.querySelectorAll("div.sense.has-sn")
        .forEach((div: Element) => {
          let guideWord = div.querySelector("span.sl")?.textContent?.trim().toLowerCase();
          let description = div.querySelector("span.dtText")?.textContent?.trim().replace(/:?/g, "") ?? "";

          let sense: Sense = {
            description: description,
            guideWord: guideWord
          };
          senses.push(sense);
        });

      let _word: Word = {
        word: word,
        senses: senses
      };
      words.push(_word);
    } catch (e) {
      continue;
    }
  }

  for (let word of words) {
    fs.appendFileSync("merriam.md", `## ${word.word}\n\n`);
    console.log(word.word);
    for (let sense of word.senses) {
      let message = `* ${sense.wordClass ? `[__${sense.wordClass}__]` : ""} ${sense.guideWord ? `(_${sense.guideWord}_)` : ""} ${sense.description}\n`;
      fs.appendFileSync("merriam.md", message);
      console.log(message);
    }
    fs.appendFileSync("merriam.md", `\n`);
  }
}
await cambridge();
await macmillan();
// await merriam();
