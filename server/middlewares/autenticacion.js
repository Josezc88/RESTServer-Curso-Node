const jwt = require('jsonwebtoken');

// ====================
// VERIFICAR TOKEN
// ====================

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        // decoded es el paylod (informacion) del token
        // añadimos la propiedad usuario a la request (peticion)
        req.usuario = decoded.usuario;
        // Indicamos que prosiga con la ejecucion de la respuesta
        next();
    });
};


// ====================
// VERIFICAR ADMIN_ROLE
// ====================

let verificarAdminRole = (req, res, next) => {
    let token = req.get('token');

    let usuario = req.usuario;
    // COMPROBAMOS EL ROLE DEL USUARIO
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'Solo administradores pueden crear/actualizar un usuario'
            }
        });
    }

    // Indicamos que prosiga con la ejecucion de la respuesta
    next();
};

module.exports = {
    verificarToken,
    verificarAdminRole
};