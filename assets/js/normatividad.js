import { quitarTildes } from '/Scripts/Buscador/assets/js/main.js';

export async function ConsultaNormatividad(terminoDeBusquedaT) {
    const folder = "Normatividad";
    const params = ["ID", "LinkFilename", "Title"];

    const terminoNormalizado = quitarTildes(terminoDeBusquedaT.toLowerCase());

    const ulrFetch = `${location.protocol}//${location.host}/Transparencia/_api/web/lists/getbytitle('${folder}')/items?$select=${params}&$top=5000`;

    try {
        let response = await fetch(ulrFetch, {
            method: "GET",
            headers: {
                Accept: "application/json; odata=verbose",
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la consulta de Normatividad: ${response.statusText}`);
        }

        let data = await response.json();

        // Verificar que data y data.d existan
        if (data && data.d) {
            let info = data.d.results;

            console.log("Resultados obtenidos:", info);

            // Verificar que data.d.results exista
            if (info) {
                // Construir y devolver los resultados
                const resultadosFiltrados = info.filter(item => {
                    const tituloNormalizado = quitarTildes(item.Title.toLowerCase());
                    return tituloNormalizado.includes(terminoNormalizado);
                });

                const resultadosNorm = resultadosFiltrados.map(item => ({
                    Title: item.Title, // Title está null, así que no lo usamos
                    url: `${location.protocol}//${location.host}/Transparencia/Normatividad/${item.LinkFilename}`,
                    id: item.ID,
                    module: "Transparencia", // Hardcoded para que coincida con el valor en la función ConsultaBuscador
                }));

                console.log("Resultados finales:", resultadosNorm);
                return resultadosNorm;
            }
        }

    } catch (error) {
        console.error(`Error en la consulta de Normatividad: ${error.message}`);
        throw error;
    }
}