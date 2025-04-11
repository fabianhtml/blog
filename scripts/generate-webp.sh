#!/bin/bash

# Script para generar versiones WebP de todas las imágenes de forma estática
# Esto debería ejecutarse solo una vez o cuando se agreguen nuevas imágenes

echo "Generando versiones WebP de las imágenes en assets/img..."

# Asegurarse de que el directorio static/img/webp existe
mkdir -p static/img/webp

# Procesar todas las imágenes JPG, JPEG y PNG
find assets/img -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r img; do
  # Obtener el nombre de archivo sin la ruta completa
  filename=$(basename "$img")
  # Obtener el nombre sin extensión
  name="${filename%.*}"
  # Crear la ruta de salida WebP
  output="static/img/webp/${name}.webp"
  
  # Solo convertir si no existe o si la imagen original es más reciente
  if [ ! -f "$output" ] || [ "$img" -nt "$output" ]; then
    echo "Convirtiendo $img a $output"
    # Convertir la imagen usando cwebp con calidad 85
    cwebp -q 85 "$img" -o "$output"
  else
    echo "Saltando $img (ya existe una versión WebP actualizada)"
  fi
done

echo "Conversión completada." 