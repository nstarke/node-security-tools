var program = require('commander');
var fs = require('fs');

program
  .option('-b, --base-url [base-url]', 'Base URL to fuzz against')
  .option('-w, --wordlist [path-to-wordlist]', 'Path to wordlist file')
  .option('-r, --response-codes [response-codes]', 'Comma seperated list of response codes to report on')
  .parse(process.argv);

var startErrors = [];

if (!program.baseUrl) {
    startErrors.push("Base Url must be set");
}

if (program.baseUrl && program.baseUrl.indexOf('FUZZ') === -1) {
    startErrors.push("Base Url must contain a FUZZ string");
}

if (!program.wordlist) {
    startErrors.push("Path to wordlist must be set");
}

if (!fs.existsSync(program.wordlist)) {
    startErrors.push("Word list file does not exist. Please specify a valid path");
}

if (!program.responseCodes) {
    startErrors.push("Response codes must be set");
}

if (startErrors.length) {
    console.log(startErrors.join('\n'));
    process.exit(1);
}

// Implement Fuzz logic
