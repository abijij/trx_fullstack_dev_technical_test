/**
 * Itera un arreglo y ejecuta una función de retorno de llamada en cada elemento.
 *
 * @param {Array} array - El arreglo a iterar.
 * @param {Function} callback - La función de retorno de llamada para ejecutar en cada elemento.
 * @returns {Promise} Promesa que se resuelve después de que se hayan ejecutado todas las funciones de retorno de llamada.
 */

module.exports = async function(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}