const fetch = require("node-fetch");
const { Router } = require('express');
const router = new Router();
const _ = require('underscore');
const res = require("express/lib/response");
const app = Router();

var urlBase = "http://pruebasmeli.somee.com/api/"
var contadorMutante = 0; // Variable golbal que almacena cuantas secuencias mutantes hay en todo el ADN
var secuenciacionParcial = false; // Variable global que define el tipo de analisis
var secuenciasMutantes = []; // Variable global que almacena la secuencias mutantes

/**
 * @swagger
 * components:
 *  schemas:
 *      mutant:
 *          type: object
 *          properties:
 *              dna:
 *                  type: array
 *                  items: 
 *                      type: string
 *                      description: Contiene las bases nitrogenadas del humano a analisar.
 *              analisisParcial: 
 *                  type: boolean
 *                  description: Con false se hace analisis completo del DNA. Con true se interrumpe el analisis en caso de detectar que es mutante.
 *          required:
 *              - dna
 *              - analisisParcial
 *          example:
 *              dna: ["AGTGAC","AAAGGT","GGTAGC","AGAAGT","GGTAGG","CGGCCC","CCGGAC"]
 *              analisisParcial: false              
 */

/**
 * @swagger
 * /api/mutant:
 *  post:
 *      summary: Analiza un DNA y determina si es o no un mutante.
 *      tags: [mutant] 
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/mutant'
 *      responses:
 *          200: 
 *              description: ADN mutante detectado.
 *          403: 
 *              description: ADN mutante no detectado. 
 *          400: 
 *              description: Peticion invalida.
 */
router.post('/', (req, res) => {
    try{
    let status = 403;
    var {dna, analisisParcial} = req.body;
    var jsonResponse = {};

    if (analisisParcial != true && analisisParcial != false) analisisParcial = true;
    secuenciacionParcial = analisisParcial;
    if(secuenciacionParcial == false) jsonResponse = {"secuenciaValida": true, "mutante": false, "analisisParcial": false, "secuenciasMutantesDetectadas": 0, "analisisCompleto": {} };
    else jsonResponse = {"secuenciaValida": true, "mutante": false, "analisisParcial": true};

    //secuenciacionParcial = false; // true: encuentra dos secuencias mutantes y no analisa mas
                            // false: analisa toda la matriz 
    var expreg = /[^ACGTacgt,]{1}/g; //Expresion para detectar bases nitrogenadas diferentes a ACGT
    secuencia = dna.toString(); //Se valida que las bases nitrogenadas sean unicamente ACGT
    if (expreg.test(secuencia) == false) {
        contadorMutante = 0;
        secuenciasMutantes = [];
        var secuenciaArray = [];
        var esMutante = false;
        var matriz = []
        var data = [] //contiene la matriz original, las filas convertidas a columnas y las diagonales en ambas direcciones convertidas a filas
        var analisisFila = {};
        var dataFinal = [];

        var contProceso = 1; //Variable que indica cuantas filas fueron analisadas
        secuencia = secuencia.toUpperCase(); //Se convierte todo a mayuscula para evitar case sesitive
        secuenciaArray = secuencia.split(",");
        secuenciaArray.forEach(element => {
            matriz.push(Array.from(element)); //Se obtiene una matriz con base en el json recibido
        });
        
        data.push(matriz);
        data.push(getColumnas(matriz));
        data.push(getDiagonales(matriz));
        data.push(getDiagonales(matriz, true));

        data.forEach(element => {
            if((contadorMutante < 2 && secuenciacionParcial == true) || (secuenciacionParcial == false)){
                element.forEach(fila =>{
                    if((fila.length >=4 && secuenciacionParcial == true) || (secuenciacionParcial == false))
                    //console.log(contProceso);
                    contProceso++;
                    analisisFila = getSecuenciasConsecutivas(fila);
                    //console.log(analisisFila)
                    dataFinal.push(analisisFila);
                })
            }
        });

        if (contadorMutante > 1) {
            esMutante = true;
            status = 200;
        }
        else {
            esMutante = false;
            status = 403;
        } 
            if (secuenciacionParcial == true) {
                jsonResponse.secuenciaValida = true;
                jsonResponse.mutante = esMutante;
                jsonResponse.analisisParcial = true;
            } else {
                jsonResponse.secuenciaValida = true;
                jsonResponse.mutante = esMutante;
                jsonResponse.analisisParcial = false;
                jsonResponse.secuenciasMutantesDetectadas = contadorMutante;
                jsonResponse.analisisCompleto = secuenciasMutantes;
            }
        let connectUrl = urlBase + "guardarAdn";
        let jsonData = {
            "secuenciaAdn" : secuencia,
            "es_mutante": esMutante
        };
        let jsonHeaders = {
            "Content-Type": "application/json"
        };
        consumoPost(connectUrl,jsonData,jsonHeaders);
    }
    else {
        jsonResponse = {"secuenciaValida": false};
        status = 403;
    }
    res.status(status).json(jsonResponse);
    } catch (error){
        res.status(400).json({
            status: "error",
            mesaage: error.mesaage
        });
    }
});

//Funcion que esta pendiente de los errores
router.use((error, req, res, next) => {
    res.status(400).json({
        status: "error",
        mesaage: error.mesaage
    });
});

//Funcion para convertir las filas en columnas
function getColumnas (matriz) {
    resultado = new Array(matriz[0].length);   
    //Columnas
    for (let i = 0; i < matriz.length; i++) {
            //Filas    
            for (let j = 0; j < resultado.length; j++) {
                if (i==0){
                    resultado[j] = [matriz[i][j]];
                } else 
                {
                    resultado[j].push(matriz[i][j]);
                }
            }
        }
        return resultado;
    }

//Funcion para convertir las diagonales en filas
function getDiagonales (matriz, reverse = false) {
        //Se define la direccion en la cual se van a obtener las diagonales
		if (reverse == true) matriz.reverse();
		resultado = [];
        var altura = matriz.length;
		var anchura = matriz[0].length;
		var tamDiagonales = anchura - 1;
		var aux = [];
		var n = 1;
		var cont = 0;
		var contDiagonales = 0; 
		var totalDiagonales = 0; //Determina el numero total de diagonales esperado segun las dimensiones de la matriz
		if (altura > anchura) totalDiagonales = altura - anchura;
		else totalDiagonales = anchura - altura;
        for (
            // Recorre los inicios de cada diagonal en los bordes de la matriz.
            var diagonal = 1 - anchura; // Comienza con un número negativo.
            diagonal <= altura - 1; // Mientras no llegue a la última diagonal.
            diagonal += 1 // Avanza hasta el comienzo de la siguiente diagonal.
        ) {
            for (
                // Recorre cada una de las diagonales a partir del extremo superior izquierdo.
                var vertical = Math.max(0, diagonal), horizontal = -Math.min(0, diagonal);
                vertical < altura && horizontal < anchura; // Mientras no excedan los límites.
                vertical += 1, horizontal += 1 // Avanza en diagonal incrementando ambos ejes.
            ) {
				cont++;
                // Muestra cada punto de la matriz ordenadamente.
                //System.out.println(matriz[vertical][horizontal]);

				if (aux.length == matriz[0].length &&  contDiagonales < totalDiagonales){
					contDiagonales++;
					n++;
					resultado.push(aux);
					aux = [];
					aux.push(matriz[vertical][horizontal]);
				}
				else if(aux.length == tamDiagonales && contDiagonales >= totalDiagonales){
					tamDiagonales--;
					contDiagonales++;
					n++;
					resultado.push(aux);
					aux = [];
					aux.push(matriz[vertical][horizontal]);
				}
				else if(cont == ((n*(n+1))/2)){
					n++;
					aux.push(matriz[vertical][horizontal]);
					resultado.push(aux);
					aux = [];
				}
				else{
					aux.push(matriz[vertical][horizontal]);
				}
            }
        }
		resultado.push(aux); // se agrega el ultimo elemento que queda en la variable auxiliar
		return resultado;
}

//Funcion para obtener cuantos caracteres tiene cada secuencia consecutiva
//La funcion recibe solo filas
function getSecuenciasConsecutivas(fila) {
	let contadorDeValor = 1;
	let contadorDeValores = {};
	let posicion = 1;
	let resultadoPacial = {};
    let sec = "";
	for (var i = 0; i < fila.length; i++){
		if((contadorMutante < 2 && secuenciacionParcial == true) || (secuenciacionParcial == false)){
			if (fila[i]==fila[i+1]) {
				contadorDeValor++;
                sec = sec + fila[i+1];
			}
			else {
				resultadoPacial[fila[i]] = contadorDeValor;
				contadorDeValores[posicion.toString()] = resultadoPacial;
				if(contadorDeValor >= 4) {
                    contadorMutante++;
                    sec = sec + fila[i];
                    secuenciasMutantes.push(sec);
                }
				contadorDeValor = 1;
				posicion ++;
				resultadoPacial = {};
			}
		} else{
			break;
		}
	}
	return contadorDeValores;
}

async function consumoPost(connectUrl,jsonData,jsonHeaders){
    await fetch(connectUrl,{
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: jsonHeaders
    })
    .then(response =>  response.json())
    .then((respuesta) => {
        console.log(respuesta);
    })
    .catch(error => {
        console.log(error);
    });
}
module.exports = router;