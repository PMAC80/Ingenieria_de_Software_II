# Ingenieria_Soft_2_Practica_Github
Ejercio de practica de manejo de errores al trabajar con otros

El ejercicio sera sobre una cancion popular.

# Fase 1: Estado inicial del repositorio (Estudiante A)
El repositorio debe iniciar con solo los primeros versos (la parte que ambos respetan). 
El Estudiante A crea el archivo letra.txt con este contenido inicial:

Muchachos, ahora nos volvimos a ilusionar  

En Argentina nací, tierra de Diego y Lionel  
de los pibes de Malvinas que jamás olvidaré  

No te lo puedo explicar  
porque no vas a entender  
las finales que perdimos, cuantos años las lloré  

# Fase 2: Clonación simultánea (Ambos estudiantes)
Ambos deben clonar ANTES de que cualquiera haga push de su versión final. 
Esto es crítico: si el Alumno B clona después de que el Alumno A ya subió su versión, 
el Alumno B tendrá la versión del Alumno A y no habrá conflicto.


Cada uno crea su rama: (el ejercio puede trabajarse sin ramas, pero es lo comun en ambientes de trabajo
que cada uno trabaje en su rama y luego sea un responsable del proyecto el que se encargue de los merges 
a la rama principal)

Estudiante A:
git checkout -b verso-original

Estudiante B:
git checkout -b verso-modificado

# Fase 3: Trabajo paralelo (Ambos en sus casas, simultáneamente)
Estudiante A edita letra.txt y agrega al final los versos originales:

Pero eso se terminó, porqué en el Maracaná  
la final con los brazucas la volvió a ganar Papá  

Muchachos, ahora nos volvimos a ilusionar  
Quiero ganar la tercera, quiero ser campeón mundial  

Y al Diego, desde el cielo lo podemos ver  
con Don Diego y con La Tota, alentándolo a Lionel  


Estudiante B edita letra.txt (sobre la misma versión base que A) y agrega al final su versión:

Pero eso se terminó,porque en Qatar,  
la final con los franceses la volvió a ganar papá.  

Muchachos, ahora solo queda festejar,  
ya ganamos la tercera,  
ya somos campeón mundial.  
Y al Diego, le decimos que descanse en paz,  
con Don Diego y con la Tota, por toda la eternidad.  

# Fase 4: Primer Push y Pull Request (Estudiante A)

git add letra.txt
git commit -m "Agrega verso original: Maracaná y homenaje a Diego"
git push origin verso-original

El Estudiante A va a GitHub → pestaña "Pull requests" → "New pull request" → selecciona verso-original 
hacia main → "Create pull request" → "Merge pull request".
En este momento, main en GitHub tiene la versión del Estudiante A.


# Fase 5: Sincronización y Conflicto (Estudiante B)
El Estudiante B hace commit de sus cambios locales:

git add letra.txt
git commit -m "Agrega verso modificado: Qatar y homenaje eterno"

*******  Antes de hacer push, debe traer los cambios de main a su rama: *******

git fetch origin
git merge origin/main

AQUI GIT MUESTRA EL CONFLICTO

# Fase 6: Resolución del conflicto (Estudiante B)
Al abrir letra.txt, el Estudiante B verá los marcadores de conflicto:

las finales que perdimos, cuantos años las lloré  
//  <<<<<<< HEAD  
Pero eso se terminó,porque en Qatar,  
la final con los franceses la volvió a ganar papá.  

Muchachos, ahora solo queda festejar,  
ya ganamos la tercera,  
ya somos campeón mundial.  
Y al Diego, le decimos que descanse en paz,  
con Don Diego y con la Tota, por toda la eternidad.  

//    =======  

Pero eso se terminó, porqué en el Maracaná  
la final con los brazucas la volvió a ganar Papá  

Muchachos, ahora nos volvimos a ilusionar  
Quiero ganar la tercera, quiero ser campeón mundial  

Y al Diego, desde el cielo lo podemos ver  
con Don Diego y con La Tota, alentándolo a Lionel  

//    >>>>>>> origin/main  

El Estudiante B debe:

Decidir qué versión conservar (o combinar ambas creativamente).
Eliminar todos los marcadores (<<<<<<<, =======, >>>>>>>).
Guardar el archivo.

agregar el archivo corregido, hacer commit y subir

git add letra.txt
git commit -m "Resuelve conflicto: se decide versión final de la letra"
git push origin verso-modificado


# Fase 7: Segundo Pull Request (Estudiante B)
El Estudiante B va a GitHub → "New pull request" → selecciona verso-modificado 
hacia main → "Create pull request" → "Merge pull request".


# RESULTADO FINAL:
letra.txt en main tendra la version que decidio conservar el estudiante B


- Para una ejercitacion completa se podra rehacer el ejercicio intercambiando los estudiantes A y B
- para que ambos practiquen la resolucion del conflicto.



