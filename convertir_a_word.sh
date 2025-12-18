#!/bin/bash

# Script para convertir el markdown a HTML compatible con Word

INPUT_FILE="/home/user/sic-web-siar/INFORME_SEGURIDAD_COMPLETO.md"
OUTPUT_FILE="/home/user/sic-web-siar/INFORME_SEGURIDAD_COMPLETO.html"

# Crear el inicio del HTML con estilos para Word
cat > "$OUTPUT_FILE" << 'HTMLSTART'
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <meta name="Generator" content="Microsoft Word">
    <meta name="Originator" content="Microsoft Word">
    <title>Informe de Seguridad SIAR</title>
    <style>
        @page WordSection1 {
            size: 8.5in 11.0in;
            margin: 1.0in 1.0in 1.0in 1.0in;
        }
        div.WordSection1 { page: WordSection1; }
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #000000;
        }
        h1 {
            font-size: 24pt;
            font-weight: bold;
            color: #2E5090;
            border-bottom: 3px solid #2E5090;
            padding-bottom: 10px;
            margin-top: 24pt;
            margin-bottom: 12pt;
        }
        h2 {
            font-size: 18pt;
            font-weight: bold;
            color: #2E5090;
            border-bottom: 2px solid #4472C4;
            padding-bottom: 6px;
            margin-top: 18pt;
            margin-bottom: 10pt;
        }
        h3 {
            font-size: 14pt;
            font-weight: bold;
            color: #4472C4;
            margin-top: 14pt;
            margin-bottom: 8pt;
        }
        h4 {
            font-size: 12pt;
            font-weight: bold;
            color: #5B9BD5;
            margin-top: 12pt;
            margin-bottom: 6pt;
        }
        p {
            margin-top: 6pt;
            margin-bottom: 6pt;
        }
        strong, b {
            font-weight: bold;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 12pt 0;
        }
        th {
            background-color: #2E5090;
            color: white;
            padding: 8pt;
            text-align: left;
            font-weight: bold;
            border: 1pt solid #D0D0D0;
        }
        td {
            padding: 6pt 8pt;
            border: 1pt solid #D0D0D0;
        }
        tr:nth-child(even) {
            background-color: #F2F2F2;
        }
        pre, code {
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 9pt;
            background-color: #F5F5F5;
        }
        pre {
            padding: 10pt;
            border-left: 4pt solid #2E5090;
            margin: 10pt 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        code {
            padding: 2pt 4pt;
        }
        ul, ol {
            margin-left: 20pt;
        }
        li {
            margin-bottom: 4pt;
        }
        hr {
            border: none;
            border-top: 1pt solid #D0D0D0;
            margin: 12pt 0;
        }
    </style>
</head>
<body>
<div class="WordSection1">
HTMLSTART

# Procesar el markdown línea por línea
in_code_block=false
in_table=false

while IFS= read -r line; do
    # Detectar bloques de código
    if [[ "$line" =~ ^'```' ]]; then
        if [ "$in_code_block" = false ]; then
            echo "<pre><code>" >> "$OUTPUT_FILE"
            in_code_block=true
        else
            echo "</code></pre>" >> "$OUTPUT_FILE"
            in_code_block=false
        fi
        continue
    fi
    
    # Si estamos en un bloque de código, simplemente agregar la línea
    if [ "$in_code_block" = true ]; then
        echo "$line" | sed 's/</\&lt;/g; s/>/\&gt;/g' >> "$OUTPUT_FILE"
        continue
    fi
    
    # Detectar tablas
    if [[ "$line" =~ ^\|.*\|$ ]]; then
        if [ "$in_table" = false ]; then
            echo "<table>" >> "$OUTPUT_FILE"
            in_table=true
            # Primera línea es el header
            echo "<tr>" >> "$OUTPUT_FILE"
            echo "$line" | sed 's/^|//; s/|$//' | awk -F'|' '{
                for(i=1; i<=NF; i++) {
                    gsub(/^[ \t]+|[ \t]+$/, "", $i);
                    print "<th>" $i "</th>"
                }
            }' >> "$OUTPUT_FILE"
            echo "</tr>" >> "$OUTPUT_FILE"
        elif [[ "$line" =~ ^\|[-:| ]+\|$ ]]; then
            # Línea separadora, ignorar
            continue
        else
            # Fila de datos
            echo "<tr>" >> "$OUTPUT_FILE"
            echo "$line" | sed 's/^|//; s/|$//' | awk -F'|' '{
                for(i=1; i<=NF; i++) {
                    gsub(/^[ \t]+|[ \t]+$/, "", $i);
                    print "<td>" $i "</td>"
                }
            }' >> "$OUTPUT_FILE"
            echo "</tr>" >> "$OUTPUT_FILE"
        fi
        continue
    else
        if [ "$in_table" = true ]; then
            echo "</table>" >> "$OUTPUT_FILE"
            in_table=false
        fi
    fi
    
    # Procesar encabezados
    if [[ "$line" =~ ^####\  ]]; then
        echo "<h4>${line##### }</h4>" >> "$OUTPUT_FILE"
    elif [[ "$line" =~ ^###\  ]]; then
        echo "<h3>${line### }</h3>" >> "$OUTPUT_FILE"
    elif [[ "$line" =~ ^##\  ]]; then
        echo "<h2>${line## }</h2>" >> "$OUTPUT_FILE"
    elif [[ "$line" =~ ^#\  ]]; then
        echo "<h1>${line# }</h1>" >> "$OUTPUT_FILE"
    elif [[ "$line" =~ ^---$ ]]; then
        echo "<hr>" >> "$OUTPUT_FILE"
    elif [[ "$line" =~ ^-\  ]]; then
        # Lista
        if [[ ! "$prev_line" =~ ^-\  ]] && [[ ! "$prev_line" =~ ^$ ]]; then
            echo "<ul>" >> "$OUTPUT_FILE"
        fi
        echo "<li>${line#- }</li>" >> "$OUTPUT_FILE"
    elif [[ "$line" =~ ^\*\*.*:\*\*\  ]]; then
        # Bold con dos puntos (para secciones como "Fecha:")
        processed=$(echo "$line" | sed 's/\*\*\([^*]*\)\*\*/<strong>\1<\/strong>/g')
        echo "<p>$processed</p>" >> "$OUTPUT_FILE"
    elif [ -z "$line" ]; then
        # Cerrar lista si estábamos en una
        if [[ "$prev_line" =~ ^-\  ]]; then
            echo "</ul>" >> "$OUTPUT_FILE"
        fi
        echo "<p>&nbsp;</p>" >> "$OUTPUT_FILE"
    else
        # Procesar negritas y código inline
        processed=$(echo "$line" | sed '
            s/\*\*\([^*]*\)\*\*/<strong>\1<\/strong>/g
            s/`\([^`]*\)`/<code>\1<\/code>/g
        ')
        echo "<p>$processed</p>" >> "$OUTPUT_FILE"
    fi
    
    prev_line="$line"
done < "$INPUT_FILE"

# Cerrar tabla si quedó abierta
if [ "$in_table" = true ]; then
    echo "</table>" >> "$OUTPUT_FILE"
fi

# Cerrar código si quedó abierto
if [ "$in_code_block" = true ]; then
    echo "</code></pre>" >> "$OUTPUT_FILE"
fi

# Cerrar el HTML
cat >> "$OUTPUT_FILE" << 'HTMLEND'
</div>
</body>
</html>
HTMLEND

echo "Archivo HTML generado: $OUTPUT_FILE"
echo "Puedes abrir este archivo en Microsoft Word y guardarlo como .docx"
