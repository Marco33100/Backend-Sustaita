const cors= require('cors');
//Creacion de la API
//Creacion de las instancias de las dependencias
const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

//Se crea la app en express
const app = express()

//Uso de cors
app.use(cors());

//Configuración de la cabecera donde se solicita permita
//peticiones de todos los sitios y todos los metodos que consuma la app
app.use(function(req, res, next){
    res.setHeader('Access-control-Allow-Origin','*')
    res.setHeader ('Access-control-Allow-Methods','*')
    next()
});

//En este punto se utiliza el bodyparser
app.use(bodyParser.json())

//Se configura el puerto a utilizar
const PUERTO = 3000

//Se crea la instancia de la conexion a Base de datos
const conexion = mysql.createConnection(
    {
        host:'localhost', 
        //nombre de la base de datos
        database:'superheroes', 
        //credenciales de mysql 
        user:'root',
        password:'marco331'
    }
)

//Puerto a utilizar y se muestra mensaje de ejecución
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`)
})

//Verificar que la conexión sea exitosa
conexion.connect(error =>{ 
    if (error) throw error
    console.log('Conexión exitosa a la BD')
})

//Se crea la raíz de la API
app.get('/',(req, res) => {
    res.send('API')
})

//End point para obtener todos los heroes
app.get('/heroes',(req,res) => {
    //crear la consulta sql
    const query = 'SELECT * from heroes'
    //se pasa la consulta a la conexión
    conexion.query(query, (error,resultado) => { 
        //si hay un error muestra en consola el error
        if (error) return console.error(message) 
        //si el resultado es mayor que 0 se tienen los registros 
        //y envia en formato json el resultado 
        if (resultado.length > 0){
            res.json(resultado)
        }else{
            res.json('No hay registros')
        }
    })
})

//End point para obtener todos los heroes por id
app.get('/heroes/:id', (req, res)=>{
    //se desestructura el id de los parametros
    const { id } = req.params
    // consulta sql
    const query = `SELECT * FROM heroes WHERE id=${id}`

    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message)

        if(resultado.length > 0){
            res.json(resultado)
        }else{
            res.json('No hay registros con el id')
        }
    })
})


//End point para obtener agregar un heroe
app.post('/heroes', (req, res) =>{
    const heroe = {
        superhero: req.body.superhero,
        publisher: req.body.publisher,
        alter_ego: req.body.alter_ego,
        first_appearance: req.body.first_appearance,
        characters: req.body.characters,
        alt_img: req.body.alt_img
    }

    const query = `INSERT INTO heroes SET ?`
    conexion.query(query, heroe, (error, resultado) => {
    if(error) return console.error(error.message)
    
    res.json('Se inserto correctamente el heroe')

    })
})


//End point para actualizar un heroe
app.patch('/heroes/:id',(req, res) => {
    const { id } = req.params
    const heroe = {
        superhero: req.body.superhero,
        publisher: req.body.publisher,
        alter_ego: req.body.alter_ego,
        first_appearance: req.body.first_appearance,
        characters: req.body.characters,
        alt_img: req.body.alt_img
    }
    const query = `UPDATE heroes SET superhero='${heroe.superhero}',
    publisher='${heroe.publisher}', alter_ego='${heroe.alter_ego}',
    first_appearance='${heroe.first_appearance}',characters='${heroe.characters}',
    alt_img='${heroe.alt_img}' WHERE id='${id}'`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)

        res.json('Se actualizó correctamente el heroe')
    })
})





//End point para borrar un heroe por id
app.delete('/heroes/:id', (req, res) => {
    const { id } = req.params

    const query = `DELETE FROM heroes WHERE id=${id}`
    conexion.query(query, (error, resultado) =>{
        if(error) return console.error(error,message)

        res.json('Se eliminó correctamente el registro')


    })
})
    