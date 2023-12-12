import {allModules} from '/Scripts/Buscador/assets/js/main.js';
const icons ={
  web:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="iconLink">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
</svg>`,
  pdf:`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="iconLink">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
  `
}
export function mostrarResultadosModal(resultados) {
  currentPage = 1; // Reinicia la página al mostrar nuevos resultados
  const resultadosCombinados = [...resultados.buscador, ...resultados.normatividad]; // Combinar resultados
  displayData(currentPage, resultadosCombinados); // Ajusta según tus necesidades
  renderPagination(resultadosCombinados); 

  const seccionesPortalWeb = document.getElementById("seccionesPortalWeb");
  seccionesPortalWeb.innerHTML = '';
  seccionesPortalWeb.innerHTML = '<option value="">Seleccione una sección </option>';
  allModules.forEach((item) => {
      seccionesPortalWeb.innerHTML += `<option value="${item}">${separarPorMayusculas(item)}</option>`;
  });

  seccionesPortalWeb.addEventListener("change", (e) => {
      const arrayFilter = resultadosCombinados.filter(link => link.module === e.target.value);
      currentPage = 1; // Reinicia la página al aplicar el filtro
      displayData(currentPage, arrayFilter);
      renderPagination(arrayFilter);
  });
  
  $('#myModal').modal('show');
}

function paintLinks(resultados) {
  const resultadosLista = document.getElementById('resultadosBusqueda');
  resultadosLista.innerHTML = '';

  if (resultados.length > 0) {
    resultados.forEach(result => {
      const spliturl = result.url.split(".");
      const fileType = spliturl[spliturl.length -1]
      resultadosLista.innerHTML += `<li class="ListaResults">
        <div>
        ${fileType === "pdf"?icons.pdf:icons.web}
          <a class="UrlBuscador" href="${result.url}" target="__blank">${result.Title ? (result.Title.length > 50 ? shortText(result.Title, 40) : result.Title) : result.url}</a>
        </div>
        <p class="moduloPagina">Sección: <span>${separarPorMayusculas(result.module)}</span></p>
      </li>`;
    });
  } else {
    resultadosLista.innerHTML += `<li class="ResultsnotFound"><img src="/Scripts/Buscador/assets/img/PAGINA_NO_ENCONTRADA.svg"/><span class="msnResultsNot">Resultados no encontrados</span></li>`;
  }
}

function shortText(texto, longitudMaxima) {
  if (texto.length <= longitudMaxima) {
      return texto;
  } else {
      return texto.substring(0, longitudMaxima) + "...";
  }
}
function separarPorMayusculas(palabra) {
  let palabrasSeparadas = [palabra[0]];

  for (let i = 1; i < palabra.length; i++) {
      if (palabra[i] === palabra[i].toUpperCase()) {
          palabrasSeparadas.push(palabra[i]);
      } else {
          palabrasSeparadas[palabrasSeparadas.length - 1] += palabra[i];
      }
  }

  return palabrasSeparadas.join(' ');
}

const itemsPerPage = 5;
let currentPage = 1;

function displayData(page, resultados) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = resultados.slice(startIndex, endIndex);
    paintLinks(pageData);
}

function renderPagination(resultados) {
  const pagination = document.getElementById('pagination');
  const pageCount = Math.ceil(resultados.length / itemsPerPage);

  pagination.innerHTML = '';
  const maxPageButtons = 5; // Número máximo de botones de página que quieres mostrar
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));

  for (let i = startPage; i <= Math.min(startPage + maxPageButtons - 1, pageCount); i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.href = '#';
      a.textContent = i;
      li.appendChild(a);

      a.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage = i;
          displayData(currentPage, resultados);
          renderPagination(resultados);
      });

      if (i === currentPage) {
          li.classList.add('active');
      }

      pagination.appendChild(li);
  }

  // Agregar botones de flechas
  if (currentPage > 1) {
      const prevButton = document.createElement('li');
      prevButton.classList.add('page-item');
      const prevLink = document.createElement('a');
      prevLink.classList.add('page-link');
      prevLink.href = '#';
      prevLink.innerHTML = '&laquo;'; // Flecha izquierda
      prevButton.appendChild(prevLink);

      prevLink.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage--;
          displayData(currentPage, resultados);
          renderPagination(resultados);
      });

      pagination.insertBefore(prevButton, pagination.firstChild);
  }

  if (currentPage < pageCount) {
      const nextButton = document.createElement('li');
      nextButton.classList.add('page-item');
      const nextLink = document.createElement('a');
      nextLink.classList.add('page-link');
      nextLink.href = '#';
      nextLink.innerHTML = '&raquo;'; // Flecha derecha
      nextButton.appendChild(nextLink);

      nextLink.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage++;
          displayData(currentPage, resultados);
          renderPagination(resultados);
      });

      pagination.appendChild(nextButton);
  }
}