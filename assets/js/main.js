let dataGlobal = [];
let PaginasEncontradas = [];
export const allModules = ["Transparencia", "ServiciosAtencionCiudadania", "Participa", "MiMunicipio", "Nosotros", "Noticias"];

// Función para quitar tildes
export function quitarTildes(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function ConsultaBuscador(terminoDeBusqueda) {
    const folder = "Páginas";
    const params = ["ID", "LinkFilename", "Title"];

    const terminoNormalizado = quitarTildes(terminoDeBusqueda.toLowerCase());

    // Limpiar los resultados anteriores en cada nueva búsqueda
    dataGlobal = [];

    for (const module of allModules) {
        const ulrFetch = `${location.protocol}//${location.host}/${module}/_api/web/lists/getbytitle('${folder}')/items?$select=${params}&$top=5000`;


        try {
            let response = await fetch(ulrFetch, {
                method: "GET",
                headers: {
                    Accept: "application/json; odata=verbose",
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la consulta para el módulo ${module}: ${response.statusText}`);
            }

            let data = await response.json();

            // Verificar que data y data.d existan
            if (data && data.d) {
                let info = data.d.results;

                // Verificar que data.d.results exista
                if (info) {

                    // Filtrar los resultados que coinciden con el término de búsqueda, incluso sin tildes
                    const resultadosFiltrados = info.filter(item => {
                        const tituloNormalizado = quitarTildes(item.Title.toLowerCase());
                        return tituloNormalizado.includes(terminoNormalizado);
                    });
                    // Agregar los resultados de esta consulta a dataGlobal
                    dataGlobal = dataGlobal.concat(resultadosFiltrados);
                }
            }

        } catch (error) {
            console.error(`Error en la consulta para el módulo ${module}: ${error.message}`);
        }
    }
    PaginasEncontradas = [];

    dataGlobal.forEach((item) => {
        const sliptUrl = item["__metadata"].uri.split("//");
        const url = sliptUrl[1].split("/")

        const newUrl = {
            Title: item.Title,
            url: `${location.protocol}//${location.host}/${url[1]}/Paginas/${item.LinkFilename}`,
            id: item.ID,
            module: url[1]
        }
        PaginasEncontradas.push(newUrl)
    })

    // Devolver los resultados encontrados
    return PaginasEncontradas;
}