import { ConsultaBuscador } from '/Scripts/Buscador/assets/js/main.js';
import { ConsultaNormatividad } from '/Scripts/Buscador/assets/js/normatividad.js';
import { mostrarResultadosModal } from '/Scripts/Buscador/assets/js/ui.js';


const guardarBoton = document.getElementById('guardarBoton');
const campoDeBusqueda = document.getElementById('search');

guardarBoton.addEventListener('click', async function(event) {
  // Evita que el formulario se envíe y la página se recargue
  event.preventDefault();
  if (campoDeBusqueda.value.length > 0) {
      try {
          // Consulta de Buscador
          const resultadosBuscador = await ConsultaBuscador(campoDeBusqueda.value);

          // Consulta de Normatividad
          const resultadosNormatividad = await ConsultaNormatividad(campoDeBusqueda.value);

          // Objeto de resultados integrados
          const resultadosIntegrados = {
              buscador: resultadosBuscador,
              normatividad: resultadosNormatividad,
          };

          // Mostrar resultados en el modal
          mostrarResultadosModal(resultadosIntegrados);

          const palabraBuscada = document.getElementById("palabraBuscada");
          palabraBuscada.innerText = campoDeBusqueda.value;

          $('#myModal').on('hidden.bs.modal', function () {
              // Limpiar el valor del input
              campoDeBusqueda.value = '';
          });
      } catch (error) {
          console.error('Error en la consulta:', error);
      }
  } else {
      // Mostrar mensaje de error
      Toastify({
          text: "Por favor, agrega una palabra",
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
              background: "#FF0000",
          },
          onClick: function(){}
      }).showToast();
  }
});