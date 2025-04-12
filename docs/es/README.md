# txtspy

txtspy es una herramienta de línea de comandos(CLI) para analizar archivos de texto. Proporciona estadísticas como el número de palabras y caracteres, identifica las palabras más frecuentes y filtra las stopwords. Está diseñada para soportar múltiples idiomas (actualmente inglés y español) y se encuentra en desarrollo activo.

> ⚠️ Este proyecto está actualmente en desarrollo.

## Funcionalidades

- Analiza uno o más archivos de texto.
- Muestra estadísticas de frecuencia de palabras.
- Genera estadísticas sobre el contenido de archivos, incluyendo el conteo y la frecuencia de palabras
- Filtra las stopwords del análisis.
- Soporte para múltiples idiomas (inglés y español).
- Interfaz por línea de comandos con comandos y flags intuitivos.
- Cambio de idioma en ejecución.
- Funcionalidades planificadas:
  - Descargar análisis como archivo `.txt`.
  - Análisis de páginas web mediante URL.
  - Soporte de flag --big para escaneo de archivos grandes mediante streams.

## Instalación

El proyecto se publicará pronto en NPM. Por ahora, se puede clonar y ejecutar localmente:

```bash
git clone https://github.com/your-username/txtspy.git
cd txtspy
npm install
npx tsx bin/txtspy.ts
```

## Uso

```
txtspy <cmd> [args]
```

### Comandos Disponibles

#### Buscar una palabra en un archivo
> Utilizando "" puedes buscar una frase

```bash
txtspy search <palabra> <archivo>
```

Ejemplo:
```bash
txtspy search "función" src/utils.js
```

#### Buscar una palabra en múltiples archivos
> Utilizando "" puedes buscar una frase

```bash
txtspy multi <palabra> <archivo1> <archivo2>
```

Ejemplo:
```bash
txtspy multi import src/index.ts src/utils.ts
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
- `--top`: Muestra el top de palabras más frecuentes según el número indicado por el usuario

Ejemplo:
```bash
txtspy stats documento.txt --lang es
```

```bash
txtspy stats documento.txt --top 7
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

## Estado de Desarrollo

Este proyecto aún está en desarrollo. Próximas funcionalidades incluyen:

### Soporte para Streaming de Archivos

Se implementará una nueva bandera `--big` para procesar archivos grandes de manera eficiente utilizando streams de Node.js. Esto permitirá a TxtSpy analizar archivos de texto muy grandes sin un uso excesivo de memoria.

### Análisis Web

Versiones futuras incluirán la capacidad de analizar contenido web directamente desde URLs. Esta característica extraerá contenido textual de sitios web y proporcionará estadísticas sobre frecuencia de palabras y otras métricas, las estadísticas podrán descargarse en un archivo `.txt`.
