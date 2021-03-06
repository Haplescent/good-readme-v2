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
    {
      name: "repoName",
      message: "Name of Repo?",
    },
  ])
  .then((answers) => {
    // console.log(answers);

    axios
      .get(`https://api.github.com/users/${answers.Github}`, config)
      .then(function (res) {
        writeFileAsync(
          "readMeOutput.md",
          `![travis build](https://img.shields.io/github/last-commit/${answers.Github}/${answers.repoName}.svg) ![travis build](https://img.shields.io/github/contributors/${answers.Github}/${answers.repoName}.svg)  ![travis build](https://img.shields.io/github/commit-activity/w/${answers.Github}/${answers.repoName}.svg)  
`
        );
        console.log(res.data.avatar_url);
        console.log(res.data.html_url);
        console.log(res);
        delete answers.intro;
        delete answers.Github;
        delete answers.repoName;
        let map = buildMap(answers);
        function writeFileToReadMe(map) {
          writeString = "";
          for (let item of map.keys()) {
            console.log(item);
            console.log(map.get(item));
            writeString += `## ${item}  
${map.get(item)}  
`;
          }
          writeString += `## Main Author  
![Profile picture](${res.data.avatar_url})  ${res.data.html_url}`;
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
        //         footString = `## Main Author
        // ![Profile picture](${res.data.avatar_url})  ${res.data.html_url}`;
        //         appendFileAsync("readMeOutput.md", footString)
        //           .then((res) => {
        //             console.log(`footString appended to readMeOutput`);
        //           })
        //           .catch((err) => {
        //             throw err;
        //           });
      });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });
