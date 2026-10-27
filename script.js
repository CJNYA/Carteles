/* =========================================================
   CARTELES DE BODEGA
   SCRIPT COMPLETO
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CLAVE_STORAGE = "cartelesBodega_v4";


/* =========================================================
   VARIABLES PRINCIPALES
========================================================= */

let carteles = [];
let idEnEdicion = null;
let seleccionados = new Set();


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const formularioCartel =
  document.getElementById("formularioCartel");

const tituloFormulario =
  document.getElementById("tituloFormulario");

const botonGuardar =
  document.getElementById("botonGuardar");

const botonNuevo =
  document.getElementById("botonNuevo");


/* ---------------------------------------------------------
   UBICACIÓN
--------------------------------------------------------- */

const tipoUbicacion =
  document.getElementById("tipoUbicacion");

const campoDeposito =
  document.getElementById("campoDeposito");

const campoBarricas =
  document.getElementById("campoBarricas");

const deposito =
  document.getElementById("deposito");

const textoBarricas =
  document.getElementById("textoBarricas");


/* ---------------------------------------------------------
   RESTO DE CAMPOS
--------------------------------------------------------- */

const litros =
  document.getElementById("litros");

const anada =
  document.getElementById("anada");

const tipoVino =
  document.getElementById("tipoVino");

const calificacion =
  document.getElementById("calificacion");

const variedad =
  document.getElementById("variedad");


/* ---------------------------------------------------------
   MENSAJES
--------------------------------------------------------- */

const mensajeEstado =
  document.getElementById("mensajeEstado");


/* ---------------------------------------------------------
   VISTA PREVIA
--------------------------------------------------------- */

const prevEtiquetaUbicacion =
  document.getElementById(
    "prevEtiquetaUbicacion"
  );

const prevDeposito =
  document.getElementById("prevDeposito");

const prevLitros =
  document.getElementById("prevLitros");

const prevAnada =
  document.getElementById("prevAnada");

const prevTipoVino =
  document.getElementById("prevTipoVino");

const prevCalificacion =
  document.getElementById("prevCalificacion");

const prevVariedad =
  document.getElementById("prevVariedad");


/* ---------------------------------------------------------
   IMPORTACIÓN
--------------------------------------------------------- */

const archivoExcel =
  document.getElementById("archivoExcel");

const botonImportarExcel =
  document.getElementById(
    "botonImportarExcel"
  );


/* ---------------------------------------------------------
   LISTA
--------------------------------------------------------- */

const listaCarteles =
  document.getElementById("listaCarteles");

const mensajeVacio =
  document.getElementById("mensajeVacio");

const contadorCarteles =
  document.getElementById(
    "contadorCarteles"
  );


/* ---------------------------------------------------------
   SELECCIÓN
--------------------------------------------------------- */

const seleccionarTodos =
  document.getElementById(
    "seleccionarTodos"
  );

const botonDeseleccionar =
  document.getElementById(
    "botonDeseleccionar"
  );

const contadorSeleccionados =
  document.getElementById(
    "contadorSeleccionados"
  );

const botonEliminarSeleccionados =
  document.getElementById(
    "botonEliminarSeleccionados"
  );

const botonImprimirSeleccionados =
  document.getElementById(
    "botonImprimirSeleccionados"
  );


/* ---------------------------------------------------------
   IMPRESIÓN
--------------------------------------------------------- */

const zonaImpresion =
  document.getElementById(
    "zonaImpresion"
  );


/* =========================================================
   INICIO
========================================================= */

cargarCarteles();

normalizarCartelesAntiguos();

actualizarCamposUbicacion();

actualizarVistaPrevia();

dibujarLista();

actualizarControles();


/* =========================================================
   LOCALSTORAGE
========================================================= */

function cargarCarteles() {

  try {

    const guardados =
      localStorage.getItem(
        CLAVE_STORAGE
      );

    if (!guardados) {

      carteles = [];

      return;
    }

    const datos =
      JSON.parse(guardados);

    if (Array.isArray(datos)) {

      carteles = datos;

    } else {

      carteles = [];

    }

  } catch (error) {

    console.error(
      "Error cargando carteles:",
      error
    );

    carteles = [];

    mostrarMensaje(
      "No se pudieron cargar los carteles guardados.",
      "error"
    );
  }
}


function guardarCarteles() {

  try {

    localStorage.setItem(
      CLAVE_STORAGE,
      JSON.stringify(carteles)
    );

    return true;

  } catch (error) {

    console.error(
      "Error guardando carteles:",
      error
    );

    mostrarMensaje(
      "No se pudieron guardar los carteles.",
      "error"
    );

    return false;
  }
}


/* =========================================================
   COMPATIBILIDAD CON CARTELES ANTIGUOS
========================================================= */

function normalizarCartelesAntiguos() {

  carteles =
    carteles.map(
      cartel => {

        const nuevo =
          {
            ...cartel
          };


        /*
          Los carteles antiguos solamente tenían
          "deposito".

          Ahora añadimos "tipoUbicacion".
        */

        nuevo.tipoUbicacion =
          obtenerTipoUbicacion(
            nuevo
          );


        /*
          Convertimos tipos antiguos a mayúsculas.
        */

        nuevo.tipoVino =
          String(
            nuevo.tipoVino || ""
          ).toUpperCase();


        return nuevo;

      }
    );
}


/* =========================================================
   ID
========================================================= */

function generarId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );

}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(
  texto,
  tipo = ""
) {

  mensajeEstado.textContent =
    texto;

  mensajeEstado.className =
    "mensaje";

  if (tipo) {

    mensajeEstado.classList.add(
      tipo
    );

  }

  if (texto) {

    setTimeout(
      () => {

        if (
          mensajeEstado.textContent ===
          texto
        ) {

          mensajeEstado.textContent =
            "";

          mensajeEstado.className =
            "mensaje";

        }

      },
      4000
    );

  }

}


/* =========================================================
   TIPO DE UBICACIÓN
========================================================= */

function obtenerTipoUbicacion(
  cartel
) {

  if (
    cartel &&
    cartel.tipoUbicacion
  ) {

    return cartel.tipoUbicacion ===
      "barricas"
      ? "barricas"
      : "deposito";

  }


  const texto =
    normalizarTexto(
      cartel?.deposito || ""
    );


  if (
    texto === "barricas" ||
    texto === "barrica" ||
    texto.includes("barrica")
  ) {

    return "barricas";

  }


  return "deposito";
}


/* =========================================================
   NORMALIZAR DEPÓSITO
========================================================= */

function normalizarValorDeposito(
  valor
) {

  const texto =
    String(
      valor ?? ""
    ).trim();


  const normalizado =
    normalizarTexto(
      texto
    );


  if (
    normalizado === "aux 1" ||
    normalizado === "aux1" ||
    normalizado === "auxiliar 1"
  ) {

    return "AUXILIAR 1";

  }


  if (
    normalizado === "aux 2" ||
    normalizado === "aux2" ||
    normalizado === "auxiliar 2"
  ) {

    return "AUXILIAR 2";

  }


  const numero =
    Number(texto);


  if (
    Number.isInteger(numero) &&
    numero >= 1 &&
    numero <= 23
  ) {

    return String(numero);

  }


  return texto;
}


/* =========================================================
   MOSTRAR / OCULTAR DEPÓSITO O BARRICAS
========================================================= */

function actualizarCamposUbicacion() {

  const esBarricas =
    tipoUbicacion.value ===
    "barricas";


  if (campoDeposito) {

    campoDeposito.hidden =
      esBarricas;

  }


  if (campoBarricas) {

    campoBarricas.hidden =
      !esBarricas;

  }


  if (deposito) {

    deposito.disabled =
      esBarricas;

    deposito.required =
      !esBarricas;

  }


  if (textoBarricas) {

    textoBarricas.disabled =
      !esBarricas;

    textoBarricas.required =
      esBarricas;

  }


  /*
    Cuando se selecciona BARRICAS
    ponemos BARRICAS por defecto.
  */

  if (
    esBarricas &&
    textoBarricas &&
    !textoBarricas.value.trim()
  ) {

    textoBarricas.value =
      "BARRICAS";

  }


  actualizarVistaPrevia();
}


/* =========================================================
   CAMBIO DE UBICACIÓN
========================================================= */

tipoUbicacion.addEventListener(
  "change",
  function () {

    actualizarCamposUbicacion();

  }
);


/* =========================================================
   CAMBIOS EN EL FORMULARIO
========================================================= */

[
  deposito,
  textoBarricas,
  litros,
  anada,
  tipoVino,
  calificacion,
  variedad
].forEach(
  elemento => {

    if (!elemento) {
      return;
    }

    elemento.addEventListener(
      "input",
      actualizarVistaPrevia
    );

    elemento.addEventListener(
      "change",
      actualizarVistaPrevia
    );

  }
);


/* =========================================================
   OBTENER DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosFormulario() {

  const tipo =
    tipoUbicacion.value ===
    "barricas"
      ? "barricas"
      : "deposito";


  const valorUbicacion =
    tipo === "barricas"
      ? textoBarricas.value.trim()
      : deposito.value.trim();


  return {

    tipoUbicacion:
      tipo,

    /*
      Conservamos "deposito"
      para mantener compatibilidad
      con los carteles antiguos.
    */

    deposito:
      valorUbicacion,

    litros:
      litros.value.trim(),

    anada:
      anada.value.trim(),

    tipoVino:
      String(
        tipoVino.value || ""
      ).toUpperCase(),

    calificacion:
      calificacion.value,

    variedad:
      variedad.value.trim()

  };
}


/* =========================================================
   VALIDAR DATOS
========================================================= */

function validarDatos(
  datos
) {

  if (
    !datos.deposito ||
    !datos.litros ||
    !datos.anada ||
    !datos.tipoVino ||
    !datos.calificacion ||
    !datos.variedad
  ) {

    mostrarMensaje(
      "Rellena todos los campos.",
      "error"
    );

    return false;
  }


  return true;
}


/* =========================================================
   GUARDAR / EDITAR CARTEL
========================================================= */

formularioCartel.addEventListener(
  "submit",
  function (evento) {

    evento.preventDefault();


    const datos =
      obtenerDatosFormulario();


    if (
      !validarDatos(datos)
    ) {

      return;

    }


    /*
      EDITAR
    */

    if (
      idEnEdicion !== null
    ) {

      const indice =
        carteles.findIndex(
          cartel =>
            cartel.id ===
            idEnEdicion
        );


      if (indice === -1) {

        mostrarMensaje(
          "No se encontró el cartel.",
          "error"
        );

        return;

      }


      carteles[indice] =
        {
          ...carteles[indice],
          ...datos
        };


      if (
        !guardarCarteles()
      ) {

        return;

      }


      mostrarMensaje(
        "Cartel modificado correctamente.",
        "exito"
      );


      cancelarEdicion();

      dibujarLista();

      return;
    }


    /*
      CREAR NUEVO
    */

    const nuevoCartel =
      {

        id:
          generarId(),

        ...datos

      };


    carteles.push(
      nuevoCartel
    );


    if (
      !guardarCarteles()
    ) {

      carteles.pop();

      return;

    }


    mostrarMensaje(
      "Cartel guardado correctamente.",
      "exito"
    );


    limpiarFormulario();

    dibujarLista();

  }
);


/* =========================================================
   BOTÓN NUEVO / CANCELAR
========================================================= */

botonNuevo.addEventListener(
  "click",
  function () {

    limpiarFormulario();

  }
);


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

  formularioCartel.reset();

  idEnEdicion =
    null;


  tituloFormulario.textContent =
    "Crear Cartel";


  botonGuardar.textContent =
    "Guardar Cartel";


  tipoUbicacion.value =
    "deposito";


  deposito.value =
    "";


  textoBarricas.value =
    "";


  actualizarCamposUbicacion();

  actualizarVistaPrevia();

}


/* =========================================================
   CANCELAR EDICIÓN
========================================================= */

function cancelarEdicion() {

  limpiarFormulario();

}


/* =========================================================
   VISTA PREVIA
========================================================= */

function actualizarVistaPrevia() {

  if (!prevDeposito) {
    return;
  }


  const esBarricas =
    tipoUbicacion.value ===
    "barricas";


  const etiqueta =
    esBarricas
      ? "BARRICAS"
      : "DEPÓSITO";


  const valor =
    esBarricas
      ? textoBarricas.value.trim()
      : deposito.value.trim();


  prevEtiquetaUbicacion.textContent =
    etiqueta;


  prevDeposito.textContent =
    valor || "—";


  prevLitros.textContent =
    litros.value.trim() ||
    "—";


  prevAnada.textContent =
    anada.value.trim() ||
    "—";


  prevTipoVino.textContent =
    String(
      tipoVino.value || ""
    ).toUpperCase() ||
    "—";


  prevCalificacion.textContent =
    calificacion.value ||
    "—";


  prevVariedad.textContent =
    variedad.value.trim() ||
    "—";

}


/* =========================================================
   DIBUJAR LISTA
========================================================= */

function dibujarLista() {

  listaCarteles.replaceChildren();


  contadorCarteles.textContent =
    carteles.length +
    (
      carteles.length === 1
        ? " cartel"
        : " carteles"
    );


  if (
    carteles.length === 0
  ) {

    mensajeVacio.style.display =
      "";

    actualizarControles();

    return;

  }


  mensajeVacio.style.display =
    "none";


  carteles.forEach(
    cartel => {

      listaCarteles.appendChild(
        crearElementoLista(
          cartel
        )
      );

    }
  );


  actualizarControles();

}


/* =========================================================
   CREAR ELEMENTO DE LISTA
========================================================= */

function crearElementoLista(
  cartel
) {

  const contenedor =
    document.createElement(
      "article"
    );

  contenedor.className =
    "item-cartel";


  /*
    CABECERA
  */

  const cabecera =
    document.createElement(
      "div"
    );

  cabecera.className =
    "cabecera-item";


  /*
    CHECKBOX
  */

  const etiqueta =
    document.createElement(
      "label"
    );

  etiqueta.className =
    "seleccion-item";


  const checkbox =
    document.createElement(
      "input"
    );

  checkbox.type =
    "checkbox";

  checkbox.checked =
    seleccionados.has(
      cartel.id
    );


  checkbox.addEventListener(
    "change",
    function () {

      if (checkbox.checked) {

        seleccionados.add(
          cartel.id
        );

      } else {

        seleccionados.delete(
          cartel.id
        );

      }


      actualizarControles();

    }
  );


  etiqueta.appendChild(
    checkbox
  );


  /*
    TÍTULO
  */

  const titulo =
    document.createElement(
      "strong"
    );


  const tipoUbicacionCartel =
    obtenerTipoUbicacion(
      cartel
    );


  const etiquetaUbicacion =
    tipoUbicacionCartel ===
    "barricas"
      ? "BARRICAS"
      : "DEPÓSITO";


  titulo.textContent =
    etiquetaUbicacion +
    ": " +
    (
      cartel.deposito ||
      "Sin ubicación"
    );


  etiqueta.appendChild(
    titulo
  );


  cabecera.appendChild(
    etiqueta
  );


  /*
    DETALLES
  */

  const detalles =
    document.createElement(
      "div"
    );

  detalles.className =
    "detalles-cartel";


  agregarDetalle(
    detalles,
    "Litros",
    cartel.litros
  );


  agregarDetalle(
    detalles,
    "Añada",
    cartel.anada
  );


  agregarDetalle(
    detalles,
    "Tipo",
    String(
      cartel.tipoVino || ""
    ).toUpperCase()
  );


  agregarDetalle(
    detalles,
    "Calificación",
    cartel.calificacion
  );


  agregarDetalle(
    detalles,
    "Uva",
    cartel.variedad
  );


  /*
    ACCIONES
  */

  const acciones =
    document.createElement(
      "div"
    );

  acciones.className =
    "acciones-item";


  /*
    EDITAR
  */

  const botonEditar =
    document.createElement(
      "button"
    );

  botonEditar.type =
    "button";

  botonEditar.className =
    "boton secundario";

  botonEditar.textContent =
    "Editar";


  botonEditar.addEventListener(
    "click",
    function () {

      editarCartel(
        cartel.id
      );

    }
  );


  /*
    ELIMINAR
  */

  const botonEliminar =
    document.createElement(
      "button"
    );

  botonEliminar.type =
    "button";

  botonEliminar.className =
    "boton peligro";

  botonEliminar.textContent =
    "Eliminar";


  botonEliminar.addEventListener(
    "click",
    function () {

      eliminarCartel(
        cartel.id
      );

    }
  );


  /*
    IMPRIMIR
  */

  const botonImprimir =
    document.createElement(
      "button"
    );

  botonImprimir.type =
    "button";

  botonImprimir.className =
    "boton principal";

  botonImprimir.textContent =
    "Imprimir";


  botonImprimir.addEventListener(
    "click",
    function () {

      imprimirCarteles(
        [cartel]
      );

    }
  );


  acciones.appendChild(
    botonEditar
  );

  acciones.appendChild(
    botonEliminar
  );

  acciones.appendChild(
    botonImprimir
  );


  contenedor.appendChild(
    cabecera
  );

  contenedor.appendChild(
    detalles
  );

  contenedor.appendChild(
    acciones
  );


  return contenedor;
}


/* =========================================================
   AGREGAR DETALLE
========================================================= */

function agregarDetalle(
  contenedor,
  etiqueta,
  valor
) {

  const linea =
    document.createElement(
      "div"
    );

  linea.className =
    "detalle";


  const nombre =
    document.createElement(
      "span"
    );

  nombre.textContent =
    etiqueta;


  const contenido =
    document.createElement(
      "strong"
    );

  contenido.textContent =
    valor || "—";


  linea.appendChild(
    nombre
  );

  linea.appendChild(
    contenido
  );


  contenedor.appendChild(
    linea
  );
}


/* =========================================================
   EDITAR CARTEL
========================================================= */

function editarCartel(
  id
) {

  const cartel =
    carteles.find(
      elemento =>
        elemento.id === id
    );


  if (!cartel) {

    mostrarMensaje(
      "No se encontró el cartel.",
      "error"
    );

    return;

  }


  idEnEdicion =
    id;


  tituloFormulario.textContent =
    "Editar Cartel";


  botonGuardar.textContent =
    "Guardar Cambios";


  const tipo =
    obtenerTipoUbicacion(
      cartel
    );


  tipoUbicacion.value =
    tipo;


  if (
    tipo === "barricas"
  ) {

    textoBarricas.value =
      cartel.deposito ||
      "BARRICAS";


    deposito.value =
      "";

  } else {

    deposito.value =
      normalizarValorDeposito(
        cartel.deposito
      );


    textoBarricas.value =
      "";

  }


  actualizarCamposUbicacion();


  litros.value =
    cartel.litros || "";


  anada.value =
    cartel.anada || "";


  tipoVino.value =
    String(
      cartel.tipoVino || ""
    ).toUpperCase();


  calificacion.value =
    cartel.calificacion || "";


  variedad.value =
    cartel.variedad || "";


  actualizarVistaPrevia();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   ELIMINAR UN CARTEL
========================================================= */

function eliminarCartel(
  id
) {

  const cartel =
    carteles.find(
      elemento =>
        elemento.id === id
    );


  if (!cartel) {
    return;
  }


  const confirmar =
    confirm(
      "¿Quieres eliminar este cartel?"
    );


  if (!confirmar) {
    return;
  }


  const anteriores =
    carteles;


  carteles =
    carteles.filter(
      elemento =>
        elemento.id !== id
    );


  seleccionados.delete(
    id
  );


  if (
    !guardarCarteles()
  ) {

    carteles =
      anteriores;

    return;

  }


  if (
    idEnEdicion === id
  ) {

    limpiarFormulario();

  }


  dibujarLista();


  mostrarMensaje(
    "Cartel eliminado.",
    "exito"
  );

}


/* =========================================================
   SELECCIONAR TODOS
========================================================= */

seleccionarTodos.addEventListener(
  "change",
  function () {

    if (
      seleccionarTodos.checked
    ) {

      seleccionados =
        new Set(
          carteles.map(
            cartel =>
              cartel.id
          )
        );

    } else {

      seleccionados.clear();

    }


    dibujarLista();

  }
);


/* =========================================================
   DESELECCIONAR
========================================================= */

botonDeseleccionar.addEventListener(
  "click",
  function () {

    seleccionados.clear();

    dibujarLista();

  }
);


/* =========================================================
   ACTUALIZAR CONTROLES
========================================================= */

function actualizarControles() {

  const cantidad =
    seleccionados.size;


  contadorSeleccionados.textContent =
    cantidad +
    (
      cantidad === 1
        ? " seleccionado"
        : " seleccionados"
    );


  seleccionarTodos.checked =
    carteles.length > 0 &&
    cantidad ===
      carteles.length;


  seleccionarTodos.indeterminate =
    cantidad > 0 &&
    cantidad <
      carteles.length;


  botonEliminarSeleccionados.disabled =
    cantidad === 0;


  botonImprimirSeleccionados.disabled =
    cantidad === 0;


  botonDeseleccionar.disabled =
    cantidad === 0;

}


/* =========================================================
   ELIMINAR SELECCIONADOS
========================================================= */

botonEliminarSeleccionados.addEventListener(
  "click",
  function () {

    if (
      seleccionados.size === 0
    ) {

      mostrarMensaje(
        "No hay carteles seleccionados.",
        "error"
      );

      return;
    }


    const confirmar =
      confirm(
        "¿Quieres eliminar los " +
        seleccionados.size +
        " carteles seleccionados?"
      );


    if (!confirmar) {
      return;
    }


    const anteriores =
      carteles;


    carteles =
      carteles.filter(
        cartel =>
          !seleccionados.has(
            cartel.id
          )
      );


    if (
      !guardarCarteles()
    ) {

      carteles =
        anteriores;

      return;

    }


    seleccionados.clear();


    dibujarLista();


    mostrarMensaje(
      "Carteles eliminados correctamente.",
      "exito"
    );

  }
);


/* =========================================================
   IMPRIMIR SELECCIONADOS
========================================================= */

botonImprimirSeleccionados.addEventListener(
  "click",
  function () {

    const paraImprimir =
      carteles.filter(
        cartel =>
          seleccionados.has(
            cartel.id
          )
      );


    if (
      paraImprimir.length === 0
    ) {

      mostrarMensaje(
        "No hay carteles seleccionados.",
        "error"
      );

      return;
    }


    imprimirCarteles(
      paraImprimir
    );

  }
);



/* =========================================================
   CREAR CARTEL PARA IMPRESIÓN
========================================================= */

function crearCartelVisual(cartel) {

  const cartelElemento = document.createElement("article");

  cartelElemento.className = "cartel cartel-impresion";

  const tipoUbicacionCartel = obtenerTipoUbicacion(cartel);

  const etiquetaUbicacion =
    tipoUbicacionCartel === "barricas"
      ? "BARRICAS:"
      : "DEPÓSITO:";

  const bloques = [
    [
      etiquetaUbicacion,
      cartel.deposito,
      "bloque-deposito"
    ],
    [
      "LITROS:",
      cartel.litros,
      ""
    ],
    [
      "AÑADA:",
      cartel.anada,
      ""
    ],
    [
      "TIPO DE VINO:",
      String(cartel.tipoVino || "").toUpperCase(),
      ""
    ],
    [
      "CALIFICACIÓN:",
      cartel.calificacion,
      ""
    ],
    [
      "VARIEDAD DE UVA:",
      cartel.variedad,
      "bloque-variedad"
    ]
  ];

  bloques.forEach(datos => {

    const bloque = document.createElement("div");
    bloque.className = "bloque-cartel";

    if (datos[2]) {
      bloque.classList.add(datos[2]);
    }

    const etiqueta = document.createElement("span");
    etiqueta.textContent = datos[0];

    const valor = document.createElement("strong");
    valor.textContent = datos[1] || "—";

    if (datos[0] === "VARIEDAD DE UVA:") {
      valor.classList.add("valor-variedad");
    }

    bloque.appendChild(etiqueta);
    bloque.appendChild(valor);

    cartelElemento.appendChild(bloque);
  });

  return cartelElemento;
}






/* =========================================================
   AJUSTAR VARIEDAD DE UVA A UNA SOLA FILA
========================================================= */

function ajustarVariedadesAntesDeImprimir() {

  const variedades = zonaImpresion.querySelectorAll(
    ".bloque-variedad .valor-variedad"
  );

  // Ancho de seguridad para el contenido del cartel A4.
  // Se deja margen para los bordes y el relleno.
  const anchoDisponible = 165 * 96 / 25.4;

  const lienzo = document.createElement("canvas");
  const contexto = lienzo.getContext("2d");

  variedades.forEach(valor => {

    const estilo = window.getComputedStyle(valor);

    const peso = estilo.fontWeight || "800";
    const familia = estilo.fontFamily || "Arial, sans-serif";

    valor.style.setProperty(
      "white-space",
      "nowrap",
      "important"
    );

    valor.style.setProperty(
      "overflow-wrap",
      "normal",
      "important"
    );

    valor.style.setProperty(
      "word-break",
      "normal",
      "important"
    );

    valor.style.setProperty(
      "display",
      "block",
      "important"
    );

    valor.style.setProperty(
      "width",
      "100%",
      "important"
    );

    valor.style.setProperty(
      "max-width",
      "100%",
      "important"
    );

    // Medir la variedad empezando por 34 puntos.
    let tamano = 34;

    contexto.font = `${peso} ${tamano}pt ${familia}`;

    const anchoTexto = contexto.measureText(
      valor.textContent || ""
    ).width;

    if (anchoTexto > 0) {

      // Reducir proporcionalmente y dejar un 5 % de margen.
      tamano = Math.min(
        34,
        34 * (anchoDisponible * 0.95 / anchoTexto)
      );

      // No permitir tamaños inferiores a 6 puntos.
      tamano = Math.max(6, tamano);

    }

    valor.style.setProperty(
      "font-size",
      tamano + "pt",
      "important"
    );

  });

}





/* =========================================================
   PREPARAR IMPRESIÓN
========================================================= */

function imprimirCarteles(
  cartelesParaImprimir
) {

  zonaImpresion.replaceChildren();


  cartelesParaImprimir.forEach(
    cartel => {

      zonaImpresion.appendChild(
        crearCartelVisual(
          cartel
        )
      );

    }
  );


  
requestAnimationFrame(() => {

  requestAnimationFrame(() => {

    ajustarVariedadesAntesDeImprimir();

    // Esperar a que se apliquen los tamaños antes de imprimir.
    requestAnimationFrame(() => {

      window.print();

    });

  });

});


}


/* =========================================================
   DESPUÉS DE IMPRIMIR
========================================================= */

window.addEventListener(
  "afterprint",
  function () {

    zonaImpresion.replaceChildren();

  }
);


/* =========================================================
   IMPORTAR EXCEL
========================================================= */

botonImportarExcel.addEventListener(
  "click",
  function () {

    archivoExcel.value =
      "";

    archivoExcel.click();

  }
);


archivoExcel.addEventListener(
  "change",
  async function () {

    const archivo =
      archivoExcel.files[0];


    if (!archivo) {
      return;
    }


    await importarExcel(
      archivo
    );

  }
);


/* =========================================================
   IMPORTACIÓN DEL EXCEL
========================================================= */

async function importarExcel(
  archivo
) {

  try {

    if (
      typeof XLSX ===
      "undefined"
    ) {

      throw new Error(
        "No se ha podido cargar el lector de Excel."
      );

    }


    mostrarMensaje(
      "Leyendo el archivo Excel..."
    );


    const datos =
      await archivo.arrayBuffer();


    const libro =
      XLSX.read(
        datos,
        {
          type: "array"
        }
      );


    if (
      !libro.SheetNames ||
      libro.SheetNames.length === 0
    ) {

      throw new Error(
        "El archivo no contiene ninguna hoja."
      );

    }


    /*
      Utilizamos la primera hoja.
    */

    const nombreHoja =
      libro.SheetNames[0];


    const hoja =
      libro.Sheets[
        nombreHoja
      ];


    const filas =
      XLSX.utils.sheet_to_json(
        hoja,
        {
          header: 1,
          defval: ""
        }
      );


    if (
      !filas.length
    ) {

      throw new Error(
        "El Excel está vacío."
      );

    }


    const filaCabeceras =
      encontrarFilaCabeceras(
        filas
      );


    if (
      filaCabeceras === -1
    ) {

      throw new Error(
        "No se encontraron las columnas necesarias del Excel."
      );

    }


    const cabeceras =
      filas[
        filaCabeceras
      ];


    const indices =
      obtenerIndicesColumnas(
        cabeceras
      );


    if (
      indices.ubicacion === -1 ||
      indices.cantidad === -1 ||
      indices.anada === -1 ||
      indices.color === -1 ||
      indices.calificacion === -1 ||
      indices.variedades === -1
    ) {

      throw new Error(
        "Faltan columnas necesarias para crear los carteles."
      );

    }


    const nuevos =
      [];


    for (
      let i =
        filaCabeceras + 1;

      i <
        filas.length;

      i++
    ) {

      const fila =
        filas[i];


      /*
        Ignoramos filas vacías.
      */

      if (
        fila.every(
          valor =>
            String(
              valor ?? ""
            ).trim() === ""
        )
      ) {

        continue;

      }


      const datos =
        convertirFilaExcel(
          fila,
          indices
        );


      const tieneDatos =
        datos.deposito ||
        datos.litros ||
        datos.anada ||
        datos.tipoVino ||
        datos.calificacion ||
        datos.variedad;


      if (!tieneDatos) {

        continue;

      }


      /*
        Las filas incompletas no se importan.
      */

      if (
        !datos.deposito ||
        !datos.litros ||
        !datos.anada ||
        !datos.tipoVino ||
        !datos.calificacion ||
        !datos.variedad
      ) {

        continue;

      }


      nuevos.push({

        id:
          generarId(),

        ...datos

      });

    }


    if (
      nuevos.length === 0
    ) {

      throw new Error(
        "No se encontraron filas válidas para crear carteles."
      );

    }


    const anteriores =
      carteles;


    carteles =
      [
        ...carteles,
        ...nuevos
      ];


    if (
      !guardarCarteles()
    ) {

      carteles =
        anteriores;

      return;

    }


    seleccionados.clear();


    dibujarLista();


    mostrarMensaje(
      "Se han importado " +
      nuevos.length +
      " carteles correctamente.",
      "exito"
    );


  } catch (error) {

    console.error(
      "Error importando Excel:",
      error
    );


    mostrarMensaje(
      error.message ||
      "No se ha podido importar el archivo Excel.",
      "error"
    );

  }

}


/* =========================================================
   BUSCAR FILA DE CABECERAS
========================================================= */

function encontrarFilaCabeceras(
  filas
) {

  for (
    let i = 0;
    i <
      Math.min(
        filas.length,
        20
      );
    i++
  ) {

    const fila =
      filas[i].map(
        valor =>
          normalizarTexto(
            valor
          )
      );


    const tieneAnada =
      fila.includes(
        "anada"
      );


    const tieneColor =
      fila.includes(
        "color"
      );


    const tieneCalificacion =
      fila.includes(
        "calificacion"
      );


    const tieneCantidad =
      fila.includes(
        "cantidad"
      );


    const tieneUbicacion =
      fila.includes(
        "ubicacion"
      );


    const tieneVariedades =
      fila.includes(
        "variedades"
      );


    if (
      tieneAnada &&
      tieneColor &&
      tieneCalificacion &&
      tieneCantidad &&
      tieneUbicacion &&
      tieneVariedades
    ) {

      return i;

    }

  }


  return -1;

}


/* =========================================================
   OBTENER ÍNDICES DE COLUMNAS
========================================================= */

function obtenerIndicesColumnas(
  cabeceras
) {

  const normalizadas =
    cabeceras.map(
      valor =>
        normalizarTexto(
          valor
        )
    );


  return {

    anada:
      buscarColumna(
        normalizadas,
        [
          "anada",
          "ano",
          "cosecha"
        ]
      ),


    color:
      buscarColumna(
        normalizadas,
        [
          "color",
          "tipo de vino",
          "tipo vino"
        ]
      ),


    calificacion:
      buscarColumna(
        normalizadas,
        [
          "calificacion",
          "calificacion vino",
          "d o",
          "do"
        ]
      ),


    cantidad:
      buscarColumna(
        normalizadas,
        [
          "cantidad",
          "litros",
          "volumen"
        ]
      ),


    unidad:
      buscarColumna(
        normalizadas,
        [
          "unidad de medida",
          "unidad",
          "ud"
        ]
      ),


    ubicacion:
      buscarColumna(
        normalizadas,
        [
          "ubicacion",
          "deposito",
          "deposito barricas",
          "barrica"
        ]
      ),


    variedades:
      buscarColumna(
        normalizadas,
        [
          "variedades",
          "variedad",
          "variedad de uva",
          "uva"
        ]
      )

  };

}


/* =========================================================
   BUSCAR COLUMNA
========================================================= */

function buscarColumna(
  cabeceras,
  nombres
) {

  for (
    const nombre of nombres
  ) {

    const indice =
      cabeceras.indexOf(
        nombre
      );


    if (
      indice !== -1
    ) {

      return indice;

    }

  }


  return -1;

}


/* =========================================================
   CONVERTIR FILA EXCEL
========================================================= */

function convertirFilaExcel(
  fila,
  indices
) {

  const valor =
    indice =>
      indice >= 0
        ? String(
            fila[indice] ??
            ""
          ).trim()
        : "";


  const anadaValor =
    valor(
      indices.anada
    );


  const colorExcel =
    valor(
      indices.color
    );


  const calificacionExcel =
    valor(
      indices.calificacion
    );


  const cantidad =
    valor(
      indices.cantidad
    );


  const unidad =
    valor(
      indices.unidad
    );


  const ubicacion =
    valor(
      indices.ubicacion
    );


  const variedades =
    valor(
      indices.variedades
    );


  const ubicacionInterpretada =
    interpretarUbicacionExcel(
      ubicacion
    );


  return {

    tipoUbicacion:
      ubicacionInterpretada.tipoUbicacion,


    deposito:
      ubicacionInterpretada.deposito,


    litros:
      cantidad +
      (
        unidad
          ? " " + unidad
          : ""
      ),


    anada:
      anadaValor,


    tipoVino:
      convertirTipoVino(
        colorExcel
      ),


    calificacion:
      convertirCalificacion(
        calificacionExcel
      ),


    variedad:
      variedades

  };

}


/* =========================================================
   INTERPRETAR UBICACIÓN DEL EXCEL
========================================================= */

function interpretarUbicacionExcel(
  valor
) {

  const texto =
    String(
      valor ?? ""
    ).trim();


  const normalizado =
    normalizarTexto(
      texto
    );


  /*
    BARRICAS
  */

  if (
    normalizado ===
      "barricas" ||
    normalizado ===
      "barrica" ||
    normalizado.includes(
      "barrica"
    )
  ) {

    return {

      tipoUbicacion:
        "barricas",

      deposito:
        "BARRICAS"

    };

  }


  /*
    AUXILIAR 1
  */

  if (
    normalizado ===
      "aux 1" ||
    normalizado ===
      "aux1" ||
    normalizado ===
      "auxiliar 1"
  ) {

    return {

      tipoUbicacion:
        "deposito",

      deposito:
        "AUXILIAR 1"

    };

  }


  /*
    AUXILIAR 2
  */

  if (
    normalizado ===
      "aux 2" ||
    normalizado ===
      "aux2" ||
    normalizado ===
      "auxiliar 2"
  ) {

    return {

      tipoUbicacion:
        "deposito",

      deposito:
        "AUXILIAR 2"

    };

  }


  /*
    DEPÓSITOS 1 - 23
  */

  const numero =
    Number(texto);


  if (
    Number.isInteger(numero) &&
    numero >= 1 &&
    numero <= 23
  ) {

    return {

      tipoUbicacion:
        "deposito",

      deposito:
        String(numero)

    };

  }


  /*
    Si aparece algo diferente,
    conservamos el texto para
    no perder información.
  */

  return {

    tipoUbicacion:
      "deposito",

    deposito:
      texto

  };

}


/* =========================================================
   CONVERSIÓN TIPO DE VINO
========================================================= */

function convertirTipoVino(
  valor
) {

  const texto =
    normalizarTexto(
      valor
    );


  if (
    texto === "tinto" ||
    texto.includes("tinto")
  ) {

    return "TINTO";

  }


  if (
    texto === "blanco" ||
    texto.includes("blanco")
  ) {

    return "BLANCO";

  }


  if (
    texto === "rosado" ||
    texto.includes("rosado")
  ) {

    return "ROSADO";

  }


  return "OTROS";

}


/* =========================================================
   CONVERSIÓN CALIFICACIÓN
========================================================= */

function convertirCalificacion(
  valor
) {

  const texto =
    normalizarTexto(
      valor
    );


  if (
    texto.includes(
      "toro"
    )
  ) {

    return "D.O. TORO";

  }


  if (
    texto.includes(
      "vtcyl"
    )
  ) {

    return "VTCYL";

  }


  if (
    texto.includes(
      "mesa"
    ) ||
    texto.includes(
      "sin igp"
    )
  ) {

    return "VINOS DE MESA (Sin IGP)";

  }


  /*
    Si la calificación no coincide
    con ninguna de las anteriores,
    usamos Vinos de Mesa.
  */

  return "VINOS DE MESA (Sin IGP)";

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(
  valor
) {

  return String(
    valor ?? ""
  )
    .trim()
    .toLowerCase()
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}