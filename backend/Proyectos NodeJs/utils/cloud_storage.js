const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env')
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();


const storage = new Storage({
    projectId: "posdev-app",
    keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://posdev-app.appspot.com/");

/**
 * Función para subir un archivo a Firebase Storage y obtener su URL.
 *
 * @param {File} file - El objeto File que será almacenado en Firebase Storage.
 * @param {string} pathImage - La ruta del archivo a subir en Firebase Storage.
 * @param {string} deletePathImage - La ruta del archivo a eliminar en Firebase Storage (opcional).
 *
 * @returns {Promise<string>} - Una promesa que resuelve a la URL pública del archivo subido en Firebase Storage.
 *
 * @throws {Error} - Si ocurre un error al subir el archivo a Firebase Storage.
 */
module.exports = (file, pathImage, deletePathImage) => {
    return new Promise((resolve, reject) => {
        
        console.log('delete path', deletePathImage)
        // Si existe una ruta para eliminar el archivo, se borra el archivo correspondiente antes de subir el nuevo archivo
        if (deletePathImage) {

            if (deletePathImage != null || deletePathImage != undefined) {
                const parseDeletePathImage = url.parse(deletePathImage)
                var ulrDelete = parseDeletePathImage.pathname.slice(23);
                const fileDelete = bucket.file(`${ulrDelete}`)

                fileDelete.delete().then((imageDelete) => {

                    console.log('se borro la imagen con exito')
                }).catch(err => {
                    console.log('Failed to remove photo, error:', err)
                });

            }
        }

        // Si se especifica una ruta para subir el archivo, se crea un stream para subir el archivo y obtener su URL
        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {

                let fileUpload = bucket.file(`${pathImage}`);
                let stream = fileUpload.createWriteStream();
                const blobStream = stream.pipe(fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                }));
                // Si ocurre un error al subir el archivo a Firebase Storage, se rechaza la promesa y se muestra un mensaje de error
                blobStream.on('error', (error) => {
                    console.log('Error al subir archivo a firebase', error);
                    reject('Something is wrong! Unable to upload at the moment.');
                });

                // Si se completa la subida del archivo a Firebase Storage, se resuelve la promesa con la URL pública del archivo
                blobStream.on('finish', () => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    console.log('URL DE CLOUD STORAGE ', url);
                    resolve(url);
                });

                blobStream.end(file.buffer);
            }
        }
    });
}