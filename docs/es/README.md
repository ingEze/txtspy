# txtspy

txtspy es una herramienta de línea de comandos (CLI) para analizar archivos de texto y gestionar directorios. Proporciona estadísticas como el número de palabras y caracteres, identifica las palabras más frecuentes y filtra las stopwords. Está diseñada para soportar múltiples idiomas (actualmente inglés y español) e incluye potentes funciones de análisis de texto.

## Funcionalidades

- Analiza uno o más archivos de texto
- Busca palabras o frases en varios archivos
- Muestra estadísticas de frecuencia de palabras
- Genera estadísticas sobre el contenido de archivos, incluyendo el conteo y la frecuencia de palabras
- Extrae comentarios de archivos de programación
- Filtra las stopwords del análisis
- Escanea directorios para mostrar la estructura de archivos
- Busca palabras específicas en todos los archivos de un directorio
- Extrae y analiza comentarios en archivos de código
- Abre archivos o directorios con la aplicación predeterminada
- Soporte para múltiples idiomas (inglés y español)
- Interfaz por línea de comandos con comandos y flags intuitivos
- Cambio de idioma en ejecución

## Instalación

Instala globalmente desde NPM:

```bash
npm install -g txtspy
```

## Uso

```
txtspy <cmd> [args]
```

### Comandos Disponibles

`search`: Buscar una palabra en un archivo o más.
`stats`: Generar estadísticas de un archivo.
`comments`: Extraer comentarios de un archivo.
`scan`: Escanear un directorio.
`open`: Abrir un archivo o directorio.
`lang`: Cambiar idioma.
`my-lang`: Mostrar idioma actual.

#### Buscar una palabra en un archivo o más
> Utilizando "" puedes buscar una frase

```bash
txtspy search <palabra> <archivo> 
```

Ejemplo:
```bash
txtspy search "function" src/utils.js
```

También puedes pasar varios archivos separados por espacios:
```bash
txtspy search console.log src/utils.js src/controllers.js
```

#### Generar estadísticas de un archivo

```bash
txtspy stats <archivo> [opciones]
```
> Si no se coloca una opción, se mostrarán las estadísticas filtrando stopwords

Opciones:
- `--lang <idioma>`: Especificar idioma para stopwords (en|es)
- `--all`: Incluir todas las palabras (no filtrar stopwords)
- `--stopwords`: Mostrar la lista de stopwords que se están filtrando
- `--top <número>`: Muestra el top de palabras más frecuentes según el número indicado por el usuario

Ejemplo:
```bash
txtspy stats documento.txt --lang es
```

```bash
txtspy stats documento.txt --top 7
```

#### Extraer comentarios de un archivo
```bash
txtspy comments <archivo> [opciones]
```
> Si no se agrega una opción, el comando funcionará en *modo estricto*.

Opciones:
- `--no-strict`: Se analizará el archivo en modo *no estricto*.

¿Qué es el modo estricto?
El *modo estricto* valida que todos los comentarios estén correctamente abiertos y cerrados.
Si se encuentra un comentario mal formado (por ejemplo, iniciado pero sin cierre), el análisis se detiene y se muestra una alerta.

Tipos de archivo soportados para extracción de comentarios:
- JavaScript (.js)
- TypeScript (.ts)
- Python (.py)
- Java (.java)
- C (.c)
- C++ (.cpp)

#### Escanear un directorio

```bash
txtspy scan <directorio> [opciones]
```
> Si no se pasa ninguna opción, el comando `scan` muestra la estructura del directorio especificado y resalta qué archivos son legibles o ilegibles según sus extension

Opciones:
- `--search <palabra>`: Busca una palabra específica en todos los archivos del directorio
- `--comments`: Extrae y muestra los comentarios de todos los archivos de código en el directorio
- `--no-strict`: Usar con --comments para forzar un formato de comentario correcto (modo predeterminado: *strict*)
- `--ignore <directorio>, -I <directorio>`: Especifica un nombre de directorio a ignorar durante el escaneo

Ejemplo:
```bash
# Mostrar estructura de directorio con archivos legibles/ilegibles
txtspy scan ./src

# Buscar una palabra específica en todos los archivos
txtspy scan ./src --search "function"

# Extraer comentarios de todos los archivos en el directorio
txtspy scan ./src --comments

# Extraer comentarios con validación estricta
txtspy scan ./src --comments --no-strict

# Escanear directorio ignorando test/
txtspy scan . --ignore test
# O usando el alias corto
txtspy scan . -I node_modules
```

#### Abrir un archivo o directorio

```bash
txtspy open <ruta>
```

Abre un archivo o directorio con la aplicación predeterminada asociada.

Ejemplo:
```bash
# Abrir directorio actual
txtspy open .

# Abrir un archivo específico
txtspy open ./src/index.js

# Abrir un directorio específico
txtspy open ./src
```

#### Cambiar idioma

```bash
txtspy lang <idioma>
```

Idiomas soportados: `en` (Inglés), `es` (Español)

Ejemplo:
```bash
txtspy lang es
```

#### Mostrar idioma actual

```bash
txtspy my-lang
```

#### Ayuda

```bash
txtspy --help
txtspy -h
```

#### Versión

```bash
txtspy --version 
txtspy -v
```

## Funcionalidades Futuras

El desarrollo de txtspy continúa con estas mejoras planificadas:

- Exportar análisis como archivo `.txt`
- Analizar páginas web mediante URL
