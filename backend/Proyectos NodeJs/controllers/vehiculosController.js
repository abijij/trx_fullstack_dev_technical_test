const Vehiculos = require('../models/vehiculos.js');


module.exports = {

    create  (req, res)  {
        const vehiculoData = req.body;
    
        Vehiculos.create(vehiculoData, (err, idVehiculo) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del vehículo',
                    error: err
                });
            }
    
            return res.status(201).json({
                success: true,
                message: 'El vehículo se almacenó correctamente',
                idVehiculo: idVehiculo
            });
        });
    },


    update(req, res){
        const product = req.body;
        Vehiculos.update(product, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del vehiculo',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El vehiculo se actualizo correctamente',
               data: data
            });
        })
    },




    delete(req, res){

        const id = req.params.id;

        Vehiculos.delete(id, (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar el vehiculo',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'El  vehiculo se elimino correctamente',
               data: `${id}`
            });   

        });
    },


    findById(req, res) {
        const id = req.params.id;
        Vehiculos.findById(id, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la obtencion del producto',
                    error: err
                });
            }

            return res.status(201).json(data);

        });
    },

    searchByModel(req, res) {
        const model = req.params.model;

        Vehiculos.searchByModel(model)
            .then((result) => {
                res.status(result.status).json(result);
            })
            .catch((error) => {
                res.status(500).json({ status: 500, message: 'Error interno en el servidor.' });
            });
    },
  
    searchByColor(req, res) {
        const color = req.params.color;

        Vehiculos.searchByColor(color)
            .then((result) => {
                res.status(result.status).json(result);
            })
            .catch((error) => {
                res.status(500).json({ status: 500, message: 'Error interno en el servidor.' });
            });
    },


    searchByYear(req, res) {
        const year = req.params.year;

        Vehiculos.searchByYear(year)
            .then((result) => {
                res.status(result.status).json(result);
            })
            .catch((error) => {
                res.status(500).json({ status: 500, message: 'Error interno en el servidor.' });
            });
    },

    searchByBrand(req, res) {
        const brand = req.params.brand;

        Vehiculos.searchByBrand(brand)
            .then((result) => {
                res.status(result.status).json(result);
            })
            .catch((error) => {
                res.status(500).json({ status: 500, message: 'Error interno en el servidor.' });
            });
    },

    getAll(req, res) {
        Vehiculos.getAll()
            .then((result) => {
                if (result.data.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ success: false, message: 'No se encontraron vehiculos.' });
                }
            })
            .catch((error) => {
                res.status(500).json(error);
            });
    },
    

}
