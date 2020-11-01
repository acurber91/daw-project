![header](doc/header.png)

# Trabajo Práctico Final

Autor:

* Agustín Curcio Berardi

Docentes:

* Agustín Bassi
* Brian Ducca
* Santiago Germino

## Índice de contenidos

1. [Introducción general](#introducción)
2. [Instalación de dependencias](#instalación-de-dependencias)
3. [Third Example](#third-example)
4. [Fourth Example](#fourth-examplehttpwwwfourthexamplecom)

## Introducción general

El Trabajo Práctico Final de la materia Desarrollo de Aplicaciones Web consiste en el diseño de una "Single Page Application (SPA)" para poder controlar dispositivos inteligentes que pueden ser instalados en una casa. La propuesta consistió en aplicar los conceptos vistos en la materia para implementar nuevas funcionalidades a un ["template"](https://github.com/ce-iot/daw-project-template) utilizado en clase y que fue desarrollado por los docentes.

## Instalación de dependencias

La aplicación fue desarrollada sobre un contenedor Docker, motivo por el cual es necesario instalar algunas dependencias antes de poder ejecutarla. En las siguientes subsecciones se brindará más información la instalación de dichas herramientas, suponiendo que se está utilizando un sistema operativo Linux basado en la distribución Ubuntu.

### Docker

Docker es una herramienta que utiliza la tecnología de contenedores de Linux para crear imágenes. En dichas imágenes es posible contar con biliotecas, entornos de ejecución, código fuente, etc. para generar una abstracción del software y hardware en el cual la aplicación se ejecuta.
Para instalarla, se deberán ejecutar los siguientes comandos.

    $ sudo apt-get update 

    $ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

Instaladas las dependencias de Docker, se debe agregar la clave:

    $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

Y se necesita verificar la huella. Para ello, se debe comprobar los últimos ocho caracteres de la misma.

    $ sudo apt-key fingerprint 0EBFCD88

Finalizada la comprobación, se requiere agregar el repositorio oficial de Docker.

    $ sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

E instalar Docker.

    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io

Una vez instalado, se necesita configurar los permisos de Docker para que un usuario pueda utilizarlo plenamente sin permisos de superusuario. Para ello, se ejecutan los siguientes comandos:

    sudo groupadd docker
    sudo usermod -aG docker $USER
    sudo gpasswd -a $USER docker

Por último, se requiere reiniciar Docker.

    sudo service docker restart

Y comprobar la instalación ejecutando un contenedor de prueba.

    sudo docker run hello-world

Si la instalación fue exitosa, deberá aparecer en la consola el siguiente mensaje:

    Unable to find image 'hello-world:latest' locally 
    latest: Pulling from library/hello-world 
    Hello from Docker! 
    ... 
    To try something more ambitious, you can run an Ubuntu container with: $ docker run -it ubuntu bash

### Docker Compose

Docker Compose es una herramienta de Docker que sirve para organizar de manera centralizada la gestión de varios contenedores de Docker que trabajan en conjunto dentro de una misma aplicación.

La instalación consiste principalmente en descargar un archivo binario y ejecutarlo. Para ello, se deberá correr el siguiente comando:

    sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

Y darle al mismo permisos de ejecución

    sudo chmod +x /usr/local/bin/docker-compose

Para verificar que la instalación fue exitosa, ejecutar el siguiente comando, el cual debería arrojar la versión de Docker Compose.

    $ docker-compose --version
    docker-compose version 1.27.4, build 1110ad01

Por último, se debe reiniciar el equipo para que Docker inicialice con todas las configuraciones realizadas.

### Imágenes de Docker

Antes de poder ejecutar el contenedor del Trabajo Práctico Final, es necesario descargar las imágenes del repositorio oficial de Docker que son necesarias para ejecutar la aplicación. Para ello, se necesita ejecutar los siguientes comandos:

    docker pull harmish/typescript
    docker pull mysql:5.7
    docker pull phpmyadmin/phpmyadmin
    docker pull abassi/nodejs-server:10.0-dev

## Introducción específica

La aplicación se ejecuta cuando un navegador se comunica con el servidor web mediante el envío de solicitudes HTTP. Dicho servidor utiliza la tecnología NodeJS para que, una vez establecida la conexión, se intercambien datos para que el navegador pueda presentar la aplicación web. La siguiente imagen muestra lo que vería el usuario al momento de ejecutarla.

## Organización del proyecto

El proyecto se encuentra conformado por la siguiente estructura de directorios y archivos:

    ├── db                          # Directorio de la base de datos (BD).
    │   ├── data                    # Estructura y datos de la BD.
    │   └── dumps                   # Directorio de estructuras de la BD.
    │       └── smart_home.sql      # Estructura con la BD "smart_home".
    ├── doc                         # Documentación general del proyecto.
    └── src                         # Directorio del código fuente.
    │   ├── back                    # Directorio para el backend de la aplicación
    │   │   ├── index.js            # Código principal del backend.
    │   │   ├── mysql-connector.js  # Código de conexion a la BD.
    │   │   ├── package.json        # Configuración de proyecto NodeJS.
    │   │   └── package-lock.json   # Configuración de proyecto NodeJS.
    │   └── front                   # Directorio para el frontend de la aplicacion
    │       ├── index.html          # Archivo principal del cliente HTML.
    │       ├── js                  # Código JavaScript compilado.
    │       ├── static              # Archivos estáticos (imágenes, CSS, fuentes).
    │       └── ts                  # Código TypeScript a compilar.
    ├── docker-compose.yml          # Archivo de configuracion del contenedor.
    ├── README.md                   # Archivo actual.
    ├── CHANGELOG.md                # Archivo para guardar cambios.
    ├── LICENSE.md                  # Archivo de licencia.



## Licence

This project is published under GPLV3+ licence.

![footer](doc/footer.png)

