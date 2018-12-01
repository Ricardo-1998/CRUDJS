const mongoose = require('mongoose');
    postModel = require('../models/post');

const PostController ={};


PostController.create = function (req, res) {
    // Codigo de obtener datos de la peticion
    let data = {
        nombre: req.body.nombre,
        autor: req.body.autor
    };
    // Validar valores
    if (data.nombre && data.autor && data.nombre != '' && data.autor != ''){
        // Crear un objeto post
        let nuevoPost =  new postModel(data);
            // Guardar en la base datos
        nuevoPost.save(function(err, guardado){
            if(err){
                res.status(500);
                res.json({code:500, err});
            } else {
                res.json({ok: true, message: 'Se a guardado con exito', guardado});
            }
        });
    
    } else {
        res.status(400);
        res.json({err:{code: 400,  message: 'Faltan datos', data}});
    }
};

PostController.getAll = function(req,res){
    postModel.find({},function(err,posts){
        if(err){
            res.status(500);
            res.json({code:500,err});
        }else{
            res.json({ok:true,posts});
        }
    });
};

PostController.get = function (req, res) {
    // Buscar por id, el psot
    postModel.findOne({_id: req.params.id }, function(err, post){
        if (err) {
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, post});
        }
    });
    // si se encontro darlo como JSON
    // sino err
}

PostController.update = function (req, res) {
    //Obtener los datos actulizar
    let update = {
        nombre: req.body.nombre,
        autor: req.body.autor
    };
     // Validar los datos
    
    // Ejecutar una actualizacion en la base datos
    postModel.findByIdAndUpdate(req.params.id, update, function(err, old){
        if (err) {
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, old, update});
        }
    });
   
    
    // Respoden si tuvo exito
    // o no 
};

PostController.delete = function (req, res) {
    // intentar eliminar
    postModel.findByIdAndRemove(req.params.id, function(err, eleminado){
        if (err) {
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, eleminado});
        }
    });
    // noitifcar resultado 
};


module.exports = PostController;