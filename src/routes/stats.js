const fetch = require("node-fetch");
const { Router } = require('express');
const router = new Router();
const _ = require('underscore');

const urlBase = "http://pruebasmeli.somee.com/api/"

/**
 * @swagger
 * /api/stats:
 *  get:
 *      summary: Devuelve estadisticas basicas
 *      responses:
 *          200: 
 *              description: Consulta exitosa.
 *          400: 
 *              description: Peticion invalida.
 */
router.get('/', (req, res) => {
    var jsonReturn = {"count_mutant_dna" : 0, "cont_human_dna" : 0,"ratio" : 0};
    let connectUrl = urlBase + "estadisticas";
    let jsonHeaders = {
        "Content-Type": "application/json"
    };
    fetch(connectUrl,{
        method: "GET",
        headers: jsonHeaders
    })
    .then(response =>  response.json())
    .then((respuesta) => {
        let ratio = 0;
        if (respuesta.cont_human_dna == 0) ratio = 0.0;
        else ratio = (respuesta.count_mutant_dna / respuesta.cont_human_dna).toFixed(1);
        jsonReturn.count_mutant_dna = respuesta.count_mutant_dna;
        jsonReturn.cont_human_dna = respuesta.cont_human_dna;
        jsonReturn.ratio = ratio;
        res.json(jsonReturn);
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            status: "error",
            mesaage: error.mesaage
        });
    });
});

//Funcion que esta escuchando los errores
router.use((error, req, res, next) => {
    res.status(400).json({
        status: "error",
        mesaage: error.mesaage
    });
});
module.exports = router;