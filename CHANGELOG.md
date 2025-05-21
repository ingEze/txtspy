# Changelog

## [1.0.0] - 2025-05-18

### Added
- **CLI Tool:** Initial release of `txtspy`, a CLI utility for scanning, searching, and analyzing text files and folders.
- **Scan Command:** Recursively scans folders, counts readable/unreadable files, and prints a tree structure.
- **Search Command:** Searches for a word in one or multiple files, highlights matches, and supports multi-language output.
- **Stats Command:** Displays statistics for a text file, including line count, word count, unique words, most common words, and top frequent words.
- **Comments Command:** Scans files for single-line and multi-line comments, with strict mode for unclosed comments.
- **Open Command:** Opens files in the default editor, with error handling and localized messages.
- **Language Support:** Supports English and Spanish for all commands and messages.
- **Config System:** Stores user preferences (like language and stopwords language) in a config file in the user’s home directory.
- **Stopwords:** Supports stopwords filtering for statistics and allows displaying the current stopwords list.
- **Ignore Directories:** Allows ignoring specific directories during scans via the `--ignore` flag.
- **Extensive Unit Tests:** Includes Jest-based unit tests for all major commands and utilities.
- **Internationalization:** All user-facing messages are translatable and localized.

### Changed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

---

## [1.0.1] - 2025-05-21

### Added
- **README Updated:** Documented all available CLI commands in the README:
  - `search`, `stats`, `comments`, `scan`, `open`, `lang`, `my-lang`
- **Code Documentation:** Added inline documentation (JSDoc) for core utility functions.

### Changed
- N/A

### Fixed
- N/A

**Thank you for using txtspy!**