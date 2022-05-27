# PruebasMeliNodeJs
----------------------------------------------------
1.	Descripción del proyecto: Api capaz de analizar cadenas de ADN en busca de coincidencias mutantes. Sus métodos son capaces de entregar un análisis completo o parcial del ADN y permite obtener las estadísticas de las cadenas analizadas con anterioridad. Este componente contiene toda la lógica utilizada para determinar si una secuencia de ADN es mutante o no. El api no interactúa directamente con la base de datos, sino que consume otro servicio creado para realizar las operaciones sobre el BD.

2.	Tecnologías: 
	Node js 16.15.0.
	Instalador de paquetes npm 8.5.5.

3.	Publicación: El desarrollo fue publicado en un servidor Heroku utilizando la línea de comandos otorgados por Heroku CLI. 

4.	Preparación de ambiente de desarrollo:
	Clonar el proyecto.
	Crear una nueva rama con git checkout –b “nombre_rama”.
	Abrir id Visual Studio Code y cargar el proyecto.
	Entrar a https://nodejs.org/es/download/ y descargar el instalador de Node, posteriormente hacer la instalación.
	Ir a https://nodejs.org/es/download/ y descargar node js. Posteriormente hacer la instalación.
	Ir a https://devcenter.heroku.com/articles/heroku-cli y descargar heroku cli. Posteriormente hace la instalación.
	En caso de necesitar más componentes hacer uso de npm para su instalación.

5.	Endpoints del api:
	Get: /api/mutant
		Descripción: Levanta un ambiente de swagger con documentación e instrucciones de consumo.
	Get: /api/ stats
		Descripción: Devuelve las estadísticas de numero de mutantes (mutants), humanos (humans) y razón (ratio).
		Respuesta: Retorna objeto JSON.
		Parámetros de la respuesta: 
			count_mutant_dna: Cantidad de mutantes identificados hasta la fecha. (Integer).
			cont_human_dna: Cantidad de humanos identificados hasta la fecha. (Integer).
			ratio: Razón entre mutantes y humanos. (String).
		Códigos de respuesta:
			200: Se retorna cuando se hizo el análisis correctamente.
			400: Se retorna cuando hay errores en la petición. 
	Post: /api/mutant
		Descripción: Permite evaluar una cadena de ADN y determinar si pertenece a un mutante o no. El método permite hacer un análisis parcial o un análisis completo.
		Entrada: Recibe un body tipo JSON.
		Parámetros del body:
			dna: Contiene las bases nitrogenadas a evaluar. Recibe un arreglo de cadenas de texto y no es case sensitive. (Array).
			analisisParcial: Recibe true para hacer análisis parcial, es decir, en caso de encontrar dos cadenas mutantes en el ADN interrumpe el análisis y retorna el resultado. Recibe false para hacer el análisis completo del ADN y retorna no solo si es mutante o no sino cuantas y cuáles fueron las secuencias mutantes encontradas. (Boolean).
		Headers: Content-Type = application/json.
		Respuesta: Retorna objeto JSON.
		Parámetros de la respuesta: 
			secuenciaValida: Retorna true en caso de que las bases nitrogenadas ingresadas en el body sean solo A, C, G o T. Retorna false si se ingresa una base nitrogenada diferente a estas. (Boolean).
			mutante: Retorna true si se encontró un mutante y false en si no se encontró. (Boolean).
			AnalisisParcial: Retorna el valor ingresado en el body de entrada. (Boolean).
			secuenciasMutantesDetectadas: Se retorna el número de secuencias mutantes encontrada. Este valor solo se calcula si el analisisParcial definido es false. (Integer).
			analisisCompleto: Retorna las bases nitrogenadas de las secuencias mutantes encontradas. Este valor solo se calcula si el analisisParcial definido es false. (Array).
		Códigos de respuesta:
			200: Se retorna cuando se encontró un mutante.
			403: Se retorna cuando no se encontró mutante o cuando la secuencia de ADN ingresada no es válida.
			400: Se retorna cuando hay errores en la petición. 

6.	Url base: http://pruebasmelinodejs.herokuapp.com

7.	Datos del autor:
	Nombre: Sebastián Tobón Carvajal.
	Correo: sebastiantc19@gmail.com
	Contacto: 3207523478.

8. Swagger
	Versión: 3.0.0.
	Descripción Framework utilizado para la documentación del api hecha en node js.
----------------------------------------------------



