# txtspy

txtspy is a command-line tool (CLI) for analyzing text files. It provides statistics such as the number of words and characters, identifies the most frequent words, and filters out stopwords. It is designed to support multiple languages (currently English and Spanish) and is under active development.

> ⚠️ This project is currently in development.

## Features

- Analyze one or more text files.
- Display word frequency statistics.
- Generate detailed content statistics including word count and frequency.
- Filter out stopwords from the analysis.
- Support for multiple languages (English | Spanish).
- Command-line interface with intuitive commands and flags.
- Language switching at runtime.
- Planned features:
  - Export analysis as a `.txt` file.
  - Analyze web pages via URL.
  - Support for `--big` flag to handle large files using streams.

## Installation

The project will soon be published on NPM. For now, you can clone and run it locally:

```bash
git clone https://github.com/your-username/txtspy.git
cd txtspy
npm install
npx txtspy <cmd>
```

## Usage

```
txtspy <cmd> [args]
```

### Available Commands

#### Search for a word in a file
> You can use quotes to search for a phrase

```bash
txtspy search <word> <file>
```

Example:
```bash
txtspy search "function" src/utils.js
```

#### Search for a word in multiple files
> You can use quotes to search for a phrase

```bash
txtspy multi <word> <file1> <file2>
```

Example:
```bash
txtspy multi import src/index.ts src/utils.ts
```

#### Generate statistics from a file

```bash
txtspy stats <file> [options]
```

> If no option is provided, statistics will be shown with stopwords filtered

Options:
- `--lang <language>`: Specify language for stopwords (en|es)
- `--all`: Include all words (do not filter stopwords)
- `--stopwords`: Display the list of stopwords being filtered
- `--top`: Show the top most frequent words based on the number specified

Example:
```bash
txtspy stats document.txt --lang es
```

```bash
txtspy stats document.txt --top 7
```

### Show comments from a file
```bash
txtspy comments <file> [options]
```

> If no option is provided, the command will run in *strict mode*

Options
- `--no-strict`: Analyze the file in *non-strict mode*.

What is strict mode?
*Strict mode* ensures that all comments are properly opened and closed.
If a malformed comment is found (e.g., one that is opened but not closed), the analysis stops and an alert is displayed.

#### Change language

```bash
txtspy lang <language>
```

Supported languages: `en` (English), `es` (Spanish)

Example:
```bash
txtspy lang es
```

#### Show current language

```bash
txtspy my-lang
```

#### Help

```bash
txtspy --help
txtspy -h
```

#### Version

```bash
txtspy --version 
txtspy -v
```

## Development Status

This project is still under active development. Upcoming features include:

### Support for Large File Streaming

A new `--big` flag will be implemented to efficiently process large files using Node.js streams. This will allow txtspy to handle very large text files without excessive memory usage.

### Web Analysis

Future versions will support analyzing text content directly from URLs. This feature will extract textual data from web pages and generate word frequency and other statistics, which can then be downloaded as a `.txt` file.