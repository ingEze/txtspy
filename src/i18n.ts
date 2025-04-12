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

export const t = (key: keyof typeof translations['en'], lang: Lang) => {
  return translations[lang][key];
}
