# txtspy

<p>
  <a href="https://github.com/ingEze/txtspy/actions/workflows/node.js.yml">
    <img src="https://github.com/ingEze/txtspy/workflows/Node.js%20CI/badge.svg" alt="Node.js CI" style="vertical-align: middle; margin-right: 10px;" />
  </a>
  <a href="https://deepwiki.com/ingEze/txtspy">
    <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" style="vertical-align: middle;" />
  </a>
</p>

# Documentation / Documentación

[<img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" width="40">](docs/en/README.md)

[<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" width="40">](docs/es/README.md)

**txtspy** is a command-line tool designed to analyze and process text files efficiently. With multiple commands for searching, analyzing, and managing files and directories, it offers a comprehensive solution for developers and text analysts.

## Features

- **Text File Analysis**: Process text files for statistics and insights
- **Word Search**: Find words or phrases across single or multiple files
- **Directory Management**: Scan directory structures and open files or folders
- **Code Analysis**: Extract and validate comments from programming files
- **Multilingual Support**: Full support for English and Spanish interfaces

## Installation

```bash
npm install -g txtspy
```

After installation, you can use txtspy from anywhere in your terminal:

```bash
txtspy <command> [options]
```

## Quick Start

```bash
# Search for a word in a file
txtspy search "function" myfile.js

# Get statistics for a text file
txtspy stats document.txt

# Scan a directory structure
txtspy scan ./src

# Open a file or directory
txtspy open ./myfile.js
```

## Development Status

txtspy is under active development. Current development priorities include:
- Exporting analysis as text files
- Web page URL analysis
- Processing large files with stream support

## Changelog

For detailed information about each release, see the [Changelog](./CHANGELOG.md).

For complete documentation on all available commands and options, please refer to the documentation in the `/docs` folder for your preferred language.
