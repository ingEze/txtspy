export type Lang = 'es' | 'en'

const translations = {
  "es": {
    USAGE: '$0 <cmd> [args]',
    INSERT_VALID: 'Insertá un comando válido',
    SEARCH_DESC: 'Buscar una palabra en un archivo',
    SEARCH_MULTI_DESC: 'Buscar una palabra en múltiples archivos',
    STATS_DESC: 'Ver estadísticas del archivo',
    STATS_ALL_DESC: 'Todo el contenido sin stopwords',
    WORD_DESC: 'Palabra a buscar',
    FILE_DESC: 'Archivo en el que buscar',
    VERSION_DESC: 'Mostrar la versión',
    LANG_DESC: 'Cambiar idioma: es | en',
    MY_LANG_DESC: 'Mostrar el lenguaje actual',
    FILE_ANALYZE: 'Archivo a analizar',
    MY_LANG: 'Idioma actual',
    STOP_WORDS_DESC: 'Muestra las stopwords que están siendo filtradas al realizar la búsqueda de estadísticas',
    TOP_WORDS_DESC: 'Muestra el top de palabras más frecuentes según el número indicado por el usuario'
  },
  "en": {
    USAGE: '$0 <cmd> [args]',
    INSERT_VALID: 'Insert a valid command',
    SEARCH_DESC: 'Search for a word in a file',
    SEARCH_MULTI_DESC: 'Search for a word in multiple files',
    STATS_DESC: 'View file statistics',
    STATS_ALL_DESC: 'All content without stopwords',
    WORD_DESC: 'Word to search',
    FILE_DESC: 'File to search in',
    VERSION_DESC: 'Show version',
    LANG_DESC: 'Change language es | en',
    MY_LANG_DESC: 'Show current language',
    FILE_ANALYZE: 'File to analyze',
    MY_LANG: 'Current Language',
    STOP_WORDS_DESC: 'Displays the stopwords that are being filtered out when performing the stats search',
    TOP_WORDS_DESC: 'Shows the top most frequent words based on the number specified by the user'
  }
}

const translationsLogsFileStats = {
  "es": {
    LOG_STOPWORDS_LANG: 'Idioma de las stopwords',
    LOG_STATS: 'Estadísticas de',
    LOG_LINES: 'Líneas',
    LOG_WORDS:  'Palabras',
    LOG_WORDS_UNIQUE: 'Palabras únicas',
    LOG_MOST_COMMON_WORD: 'Palabra más común',
    LOG_TIMES: 'veces',
    LOG_TOP: 'Top',
    LOG_TOP_WORDS: 'palabras',
    LOG_ERRROR_READ_FILE: 'Error al leer el archivo'
  },
  "en": {
    LOG_STOPWORDS_LANG: "Stopwords language",
    LOG_STATS: 'Statistics of',
    LOG_LINES: 'Lines',
    LOG_WORDS: 'Words',
    LOG_WORDS_UNIQUE: 'Unique words',
    LOG_MOST_COMMON_WORD: 'Most common word',
    LOG_TIMES: 'times',
    LOG_TOP: 'Top',
    LOG_TOP_WORDS: 'words',
    LOG_ERRROR_READ_FILE: 'Error reading the file'
  }
}

const translationsLogsFileSearch = {
  "es": {
    LOG_LINE: 'Línea',
    LOG_FILE: 'Archivo',
    LOG_NOT_FOUND_WORD: 'No se encontro la palabra que buscas',
    LOG_ERROR_READING_FILE: 'No se pudo leer el archivo',
    LOG_WORD_NOT_FOUND_IN_FILE: 'no contiene la palabra que buscas',
    LOG_WORD_FOUND_COUNT: 'Veces encontrada la palabra',
    LOG_ERROR_READING_FILES: 'No se pudo leer los archivos'
  },
  "en": {
    LOG_LINE: 'Line',
    LOG_FILE: 'File',
    LOG_NOT_FOUND_WORD: 'The word you are looking for was not found',
    LOG_ERROR_READING_FILE: 'The file could not be read',
    LOG_WORD_NOT_FOUND_IN_FILE: 'does not contain the word you are looking for',
    LOG_WORD_FOUND_COUNT: 'Times the word was found',
    LOG_ERROR_READING_FILES: 'The files could not be read'
  }
}

export const t = (key: keyof typeof translations['en'], lang: Lang) => {
  return translations[lang][key]
}

export const tLogsStats = (key: keyof typeof translationsLogsFileStats['en'], lang: Lang) => {
  return translationsLogsFileStats[lang][key]
}

export const tLogSearch = (key: keyof typeof translationsLogsFileSearch['en'], lang: Lang) => {
  return translationsLogsFileSearch[lang][key]
}