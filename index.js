const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const appendFileAsync = util.promisify(fs.appendFile);
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const config = { headers: { accept: "application/json" } };

function buildMap(obj) {
  let map = new Map();
  Object.keys(obj).forEach((key) => {
    map.set(key, obj[key]);
  });
  return map;
}

inquirer
  .prompt([
    {
      name: "intro",
      message: `A good readme consist of the following: Project title, Description, 
      Table of Contents, Installation instructions, Usage instructions, License, Contributor, 
      Tests, and Questions.  Please input each on as a terminal prompt and input your Github Username 
      to generate a good readme.md file  Press Enter to begin`,
    },
    {
      name: "Title",
      message: "Projecttitle?",
    },
    {
      name: "Description",
      message: "Description?",
    },
    {
      name: "Contents",
      message: "TableofContents?",
    },
    {
      name: "Installation",
      message: "Installation instructions?",
    },
    {
      name: "Usage",
      message: "Usage instructions?",
    },
    {
      name: "License",
      message: "License?",
    },
    {
      name: "Contributing",
      message: "Contributing?",
    },
    {
      name: "Tests",
      message: "Tests?",
    },
    {
      name: "Questions",
      message: "Questions?",
    },
    {
      name: "Github",
      message: "Github Username?",
    },
  ])
  .then((answers) => {
    // console.log(answers);

    axios
      .get(`https://api.github.com/users/${answers.Github}`, config)
      .then(function (res) {
        delete answers.intro;
        delete answers.Github;
        let map = buildMap(answers);
        writeFileAsync(
          "readMeOutput.md",
          `![travis build](https://img.shields.io/github/last-commit/Haplescent/good-readme-v2.svg)![travis build](https://img.shields.io/github/contributors/Haplescent/good-readme-v2.svg)  
`
        );
        function writeFileToReadMe(map) {
          writeString = "";
          for (let item of map.keys()) {
            console.log(item);
            console.log(map.get(item));
            writeString += `## ${item}  
${map.get(item)}  
`;
          }
          return writeString;
        }
        writtenString = writeFileToReadMe(map);
        appendFileAsync("readMeOutput.md", writtenString)
          .then((res) => {
            console.log(`writeString appended to readMeOutput`);
          })
          .catch((err) => {
            throw err;
          });
      });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });
