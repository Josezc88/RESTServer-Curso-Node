const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario,
            token
        });
    });
});

// CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    // console.log(payload.name);
    // console.log(payload.picture);
    // console.log(payload.email);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let usuarioGoogle = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: usuarioGoogle.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuario) {
            if (usuario.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    actualizado: true,
                    usuario,
                    token
                });
            }
        } else {
            // Si el usuario no existe en la DB
            //console.log(usuarioGoogle);
            let nuevoUsuario = new Usuario();
            nuevoUsuario.nombre = usuarioGoogle.nombre;
            nuevoUsuario.email = usuarioGoogle.email;
            nuevoUsuario.img = usuarioGoogle.img;
            nuevoUsuario.google = true;
            nuevoUsuario.password = ':)';
            //console.log(nuevoUsuario);

            nuevoUsuario.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario,
                    token
                });

            });
        }
    });
});

module.exports = app;