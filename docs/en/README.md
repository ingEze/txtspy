# txtspy

txtspy is a command-line tool (CLI) for analyzing text files and managing directories. It provides statistics such as the number of words and characters, identifies the most frequent words, and filters out stopwords. It supports multiple languages (currently English and Spanish) and includes powerful text analysis features.

## Features

- Analyze one or more text files
- Search for words or phrases across files
- Display word frequency statistics
- Generate detailed content statistics including word count and frequency
- Extract comments from programming files
- Filter out stopwords from analysis
- Scan directories to display file structure
- Search for specific words within all files in a directory
- Extract and analyze comments in code files
- Open files or directories with the default application
- Support for multiple languages (English | Spanish)
- Command-line interface with intuitive commands and flags
- Language switching at runtime

## Installation

Install globally from NPM:

```bash
npm install -g @ingeze/txtspy
```

## Usage

```
txtspy <cmd> [args]
```

### Available Commands

`search`: Search for a word in one or more files.
`stats`: Generate statistics from a file.  
`comments`: Extract comments from a file.
`scan`: Scan a directory.
`open`: Open a file or directory.
`lang`: Change language.  
`my-lang`: Show current language.

#### Search for a word in one or more files

> You can use quotes to search for a phrase

```bash
txtspy search <word> <file>
```

Example:

```bash
txtspy search "function" src/utils.js
```

You can also search in multiple files by listing them separated by spaces:

```bash
txtspy search console.log src/utils.js src/controllers.js
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
- `--top <number>`: Show the top most frequent words based on the number specified

Example:

```bash
txtspy stats document.txt --lang es
```

```bash
txtspy stats document.txt --top 7
```

#### Extract comments from a file

```bash
txtspy comments <file> [options]
```

> If no option is provided, the command will run in _strict mode_

Options:

- `--no-strict`: Analyze the file in _non-strict mode_

What is strict mode?
_Strict mode_ ensures that all comments are properly opened and closed.
If a malformed comment is found (e.g., one that is opened but not closed), the analysis stops and an alert is displayed.

Supported file types for comment extraction:

- JavaScript (.js)
- TypeScript (.ts)
- Python (.py)
- Java (.java)
- C (.c)
- C++ (.cpp)

#### Scan a directory

```bash
txtspy scan <directory> [options]
```

> If no option is provided, the `scan` command displays the structure of the specified directory and highlights which files are readable or unreadable based on their file extensions.

Options:

- `--search <word>`: Search for a specific word in all files in the directory
- `--comments`: Extract and display comments from all code files in the directory
- `--no-strict`: Use with --comments to enforce proper comment formatting (default mode: _strict_)
- `--ignore <directory>, -I <directory>`: Specify a directory name to ignore during scanning

Example:

```bash
# Show directory structure with readable/unreadable files
txtspy scan ./src

# Search for a specific word in all files
txtspy scan ./src --search "function"

# Extract comments from all files in the directory
txtspy scan ./src --comments

# Extract comments with strict validation
txtspy scan . --comments --no-strict

# Scan directory while ignoring test
txtspy scan . --ignore test
# Or using the short alias
txtspy scan . -I test
```

#### Open a file or directory

```bash
txtspy open <path>
```

Opens a file or directory with the default application associated with it.

Example:

```bash
# Open current directory
txtspy open .

# Open a specific file
txtspy open ./src/index.js

# Open a specific directory
txtspy open ./src
```

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

## Future Features

Development continues on txtspy with these planned enhancements:

- Exporting analysis as a `.txt` file
- Analyzing web pages via URL
