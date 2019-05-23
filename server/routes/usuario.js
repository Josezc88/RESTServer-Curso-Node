const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore'); // _ es un estandar

const app = express();
const Usuario = require('../models/usuario');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

// usurio: joseluis
// contraseña MONGODB ATLAS: eh6nEwiAbba9zxI2
// mongodb+srv://joseluis:eh6nEwiAbba9zxI2@cluster0-vz2q4.mongodb.net/cafe

app.get('/usuario', verificarToken, (req, res) => {
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    // req.query - parametros opcionales
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite) // Cantidad de registros
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    usuarios
                });
            });
        });
});

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            // usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
});

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    // Filtrar solo los datos que vamos a permitir modificar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Usuario.findByIdAndUpdate()
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        //usuarioDB.save();
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    // Borrar el registro completamente
    let id = req.params.id;
    // Eliminar completamente de la DB
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

    // "Eliminar" cambiando el estado del registro
    // Filtrar solo los datos que vamos a permitir modificar
    let nuevoEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, nuevoEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;