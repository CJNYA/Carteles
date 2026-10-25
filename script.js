"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CLAVE_STORAGE = "cartelesBodega_v4";


/* =========================================================
   ELEMENTOS
========================================================= */

const formulario = document.getElementById("formularioCartel");

const deposito = document.getElementById("deposito");
const litros = document.getElementById("litros");
const anada = document.getElementById("anada");
const tipoVino = document.getElementById("tipoVino");
const calificacion = document.getElementById("calificacion");
const variedad = document.getElementById("variedad");

const botonGuardar = document.getElementById("botonGuardar");
const botonNuevo = document.getElementById("botonNuevo");

const tituloFormulario =
  document.getElementById("tituloFormulario");

const mensajeEstado =
  document.getElementById("mensajeEstado");


const archivoExcel =
  document.getElementById("archivoExcel");

const botonImportarExcel =
  document.getElementById("botonImportarExcel");


const listaCarteles =
  document.getElementById("listaCarteles");

const contadorCarteles =
  document.getElementById("contadorCarteles");

const mensajeVacio =
  document.getElementById("mensajeVacio");


const seleccionarTodos =
  document.getElementById("seleccionarTodos");

const botonDeseleccionar =
  document.getElementById("botonDeseleccionar");

const botonEliminarSeleccionados =
  document.getElementById("botonEliminarSeleccionados");

const botonImprimirSeleccionados =
  document.getElementById("botonImprimirSeleccionados");

const contadorSeleccionados =
  document.getElementById("contadorSeleccionados");


const zonaImpresion =
  document.getElementById("zonaImpresion");


/* =========================================================
   VARIABLES
========================================================= */

let carteles = cargarCarteles();

let idEnEdicion = null;

let seleccionados = new Set();


/* =========================================================
   ID
========================================================= */

function generarId() {

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return crypto.randomUUID();

  }

  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).substring(2)
  );

}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(texto, tipo = "") {

  mensajeEstado.textContent = texto;

  mensajeEstado.className = "mensaje";

  if (tipo) {
    mensajeEstado.classList.add(tipo);
  }

}


/* =========================================================
   STORAGE
========================================================= */

function cargarCarteles() {

  try {

    const datos =
      localStorage.getItem(CLAVE_STORAGE);

    if (!datos) {
      return [];
    }

    const resultado = JSON.parse(datos);

    if (!Array.isArray(resultado)) {
      return [];
    }

    return resultado;

  } catch (error) {

    console.error(error);

    return [];

  }

}


function guardarCarteles() {

  try {

    const datos =
      JSON.stringify(carteles);

    localStorage.setItem(
      CLAVE_STORAGE,
      datos
    );

    const comprobacion =
      localStorage.getItem(CLAVE_STORAGE);

    if (comprobacion !== datos) {
      throw new Error(
        "No se pudo comprobar el almacenamiento."
      );
    }

    return true;

  } catch (error) {

    console.error(
      "Error guardando carteles:",
      error
    );

    mostrarMensaje(
      "No se han podido guardar los carteles en este navegador.",
      "error"
    );

    return false;

  }

}


/* =========================================================
   DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosFormulario() {

  return {

    deposito: deposito.value.trim(),

    litros: litros.value.trim(),

    anada: anada.value.trim(),

    tipoVino: tipoVino.value,

    calificacion: calificacion.value,

    variedad: variedad.value.trim()

  };

}


function validarDatos(datos) {

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
   GUARDAR CARTEL MANUAL
========================================================= */

formulario.addEventListener(
  "submit",
  function (evento) {

    evento.preventDefault();

    const datos =
      obtenerDatosFormulario();

    if (!validarDatos(datos)) {
      return;
    }


    if (idEnEdicion !== null) {

      const indice =
        carteles.findIndex(
          cartel =>
            cartel.id === idEnEdicion
        );


      if (indice === -1) {

        mostrarMensaje(
          "No se encontró el cartel.",
          "error"
        );

        return;

      }


      carteles[indice] = {

        ...carteles[indice],

        ...datos

      };


      if (!guardarCarteles()) {
        return;
      }


      mostrarMensaje(
        "Cartel modificado correctamente.",
        "exito"
      );

    } else {

      const nuevoCartel = {

        id: generarId(),

        ...datos

      };


      carteles.push(nuevoCartel);


      if (!guardarCarteles()) {

        carteles.pop();

        return;

      }


      mostrarMensaje(
        "Cartel guardado correctamente.",
        "exito"
      );

    }


    limpiarFormulario();

    dibujarLista();

  }
);


/* =========================================================
   NUEVO / CANCELAR
========================================================= */

botonNuevo.addEventListener(
  "click",
  function () {

    limpiarFormulario();

    mostrarMensaje("");

  }
);


function limpiarFormulario() {

  formulario.reset();

  idEnEdicion = null;

  tituloFormulario.textContent =
    "Crear cartel";

  botonGuardar.textContent =
    "Guardar Cartel";

  actualizarVistaPrevia();

}


/* =========================================================
   VISTA PREVIA
========================================================= */

function actualizarVistaPrevia() {

  document.getElementById(
    "prevDeposito"
  ).textContent =
    deposito.value.trim() || "—";


  document.getElementById(
    "prevLitros"
  ).textContent =
    litros.value.trim() || "—";


  document.getElementById(
    "prevAnada"
  ).textContent =
    anada.value.trim() || "—";


  document.getElementById(
    "prevTipoVino"
  ).textContent =
    tipoVino.value || "—";


  document.getElementById(
    "prevCalificacion"
  ).textContent =
    calificacion.value || "—";


  document.getElementById(
    "prevVariedad"
  ).textContent =
    variedad.value.trim() || "—";

}


formulario.addEventListener(
  "input",
  actualizarVistaPrevia
);


formulario.addEventListener(
  "change",
  actualizarVistaPrevia
);


/* =========================================================
   CREAR CARTEL PARA IMPRESIÓN
========================================================= */

function crearCartelVisual(cartel) {

  const articulo =
    document.createElement("article");

  articulo.className = "cartel";


  const campos = [

    [
      "DEPÓSITO / BARRICAS",
      cartel.deposito,
      "bloque-deposito"
    ],

    [
      "LITROS",
      cartel.litros,
      ""
    ],

    [
      "AÑADA",
      cartel.anada,
      ""
    ],

    [
      "TIPO DE VINO",
      cartel.tipoVino,
      ""
    ],

    [
      "CALIFICACIÓN",
      cartel.calificacion,
      ""
    ],

    [
      "VARIEDAD DE UVA",
      cartel.variedad,
      ""
    ]

  ];


  campos.forEach(
    ([titulo, valor, clase]) => {

      const bloque =
        document.createElement("div");

      bloque.className =
        "bloque-cartel" +
        (clase ? " " + clase : "");


      const etiqueta =
        document.createElement("span");

      etiqueta.textContent =
        titulo;


      const contenido =
        document.createElement("strong");

      contenido.textContent =
        valor || "—";


      bloque.appendChild(etiqueta);
      bloque.appendChild(contenido);

      articulo.appendChild(bloque);

    }
  );


  return articulo;

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


  mensajeVacio.hidden =
    carteles.length > 0;


  carteles.forEach(
    cartel => {

      const tarjeta =
        document.createElement("article");

      tarjeta.className =
        "tarjeta-guardada";


      /* CABECERA */

      const filaTitulo =
        document.createElement("div");

      filaTitulo.className =
        "fila-titulo";


      const label =
        document.createElement("label");

      label.className =
        "fila-seleccion";


      const checkbox =
        document.createElement("input");

      checkbox.type =
        "checkbox";

      checkbox.checked =
        seleccionados.has(cartel.id);

      checkbox.dataset.id =
        cartel.id;


      label.appendChild(checkbox);


      const titulo =
        document.createElement("h3");

      titulo.className =
        "titulo-cartel";

      titulo.textContent =
        cartel.deposito;


      filaTitulo.appendChild(label);
      filaTitulo.appendChild(titulo);


      tarjeta.appendChild(filaTitulo);


      /* DETALLES */

      const detalles =
        document.createElement("div");

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
        "Tipo de vino",
        cartel.tipoVino
      );

      agregarDetalle(
        detalles,
        "Calificación",
        cartel.calificacion
      );

      agregarDetalle(
        detalles,
        "Variedad de uva",
        cartel.variedad
      );


      tarjeta.appendChild(detalles);


      /* BOTONES */

      const botones =
        document.createElement("div");

      botones.className =
        "botones-tarjeta";


      const editar =
        crearBoton(
          "Editar",
          "secundario"
        );

      editar.dataset.accion =
        "editar";

      editar.dataset.id =
        cartel.id;


      const eliminar =
        crearBoton(
          "Eliminar",
          "peligro"
        );

      eliminar.dataset.accion =
        "eliminar";

      eliminar.dataset.id =
        cartel.id;


      const imprimir =
        crearBoton(
          "Imprimir",
          "principal"
        );

      imprimir.dataset.accion =
        "imprimir";

      imprimir.dataset.id =
        cartel.id;


      botones.appendChild(editar);
      botones.appendChild(eliminar);
      botones.appendChild(imprimir);


      tarjeta.appendChild(botones);


      listaCarteles.appendChild(tarjeta);

    }
  );


  actualizarControles();

}


function agregarDetalle(
  contenedor,
  nombre,
  valor
) {

  const p =
    document.createElement("p");

  const strong =
    document.createElement("strong");

  strong.textContent =
    nombre + ": ";


  p.appendChild(strong);

  p.appendChild(
    document.createTextNode(
      valor || "—"
    )
  );


  contenedor.appendChild(p);

}


function crearBoton(
  texto,
  clase
) {

  const boton =
    document.createElement("button");

  boton.type =
    "button";

  boton.className =
    "boton " + clase;

  boton.textContent =
    texto;

  return boton;

}


/* =========================================================
   EDITAR / ELIMINAR / IMPRIMIR INDIVIDUAL
========================================================= */

listaCarteles.addEventListener(
  "click",
  function (evento) {

    const boton =
      evento.target.closest(
        "button[data-accion]"
      );


    if (!boton) {
      return;
    }


    const id =
      boton.dataset.id;

    const accion =
      boton.dataset.accion;


    if (accion === "editar") {

      editarCartel(id);

    }


    if (accion === "eliminar") {

      eliminarCartel(id);

    }


    if (accion === "imprimir") {

      const cartel =
        carteles.find(
          elemento =>
            elemento.id === id
        );


      if (cartel) {

        imprimirCarteles([
          cartel
        ]);

      }

    }

  }
);


/* =========================================================
   CHECKBOX INDIVIDUAL
========================================================= */

listaCarteles.addEventListener(
  "change",
  function (evento) {

    const checkbox =
      evento.target.closest(
        "input[type='checkbox']"
      );


    if (!checkbox) {
      return;
    }


    const id =
      checkbox.dataset.id;


    if (!id) {
      return;
    }


    if (checkbox.checked) {

      seleccionados.add(id);

    } else {

      seleccionados.delete(id);

    }


    actualizarControles();

  }
);


/* =========================================================
   EDITAR
========================================================= */

function editarCartel(id) {

  const cartel =
    carteles.find(
      elemento =>
        elemento.id === id
    );


  if (!cartel) {
    return;
  }


  idEnEdicion =
    cartel.id;


  deposito.value =
    cartel.deposito;

  litros.value =
    cartel.litros;

  anada.value =
    cartel.anada;

  tipoVino.value =
    cartel.tipoVino;

  calificacion.value =
    cartel.calificacion;

  variedad.value =
    cartel.variedad;


  tituloFormulario.textContent =
    "Editar Cartel";


  botonGuardar.textContent =
    "Guardar Cambios";


  actualizarVistaPrevia();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   ELIMINAR INDIVIDUAL
========================================================= */

function eliminarCartel(id) {

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
      "¿Quieres eliminar el cartel de " +
      cartel.deposito +
      "?"
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


  if (!guardarCarteles()) {

    carteles =
      anteriores;

    return;

  }


  seleccionados.delete(id);


  if (idEnEdicion === id) {
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

    if (seleccionarTodos.checked) {

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
    cantidad === carteles.length;


  seleccionarTodos.indeterminate =
    cantidad > 0 &&
    cantidad < carteles.length;


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

    if (seleccionados.size === 0) {

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


    if (!guardarCarteles()) {

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


    if (paraImprimir.length === 0) {

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


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          window.print();

        }
      );

    }
  );

}


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

    archivoExcel.value = "";

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
      typeof XLSX === "undefined"
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
      En el Excel enviado por el usuario
      es la hoja DJR_3674.
    */

    const nombreHoja =
      libro.SheetNames[0];


    const hoja =
      libro.Sheets[nombreHoja];


    /*
      header: 1 devuelve cada fila
      como un array.
    */

    const filas =
      XLSX.utils.sheet_to_json(
        hoja,
        {
          header: 1,
          defval: ""
        }
      );


    if (!filas.length) {

      throw new Error(
        "El Excel está vacío."
      );

    }


    const filaCabeceras =
      encontrarFilaCabeceras(
        filas
      );


    if (filaCabeceras === -1) {

      throw new Error(
        "No se encontraron las columnas necesarias del Excel."
      );

    }


    const cabeceras =
      filas[filaCabeceras];


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


    /*
      Comenzamos justo después
      de la fila de cabeceras.
    */

    for (
      let i = filaCabeceras + 1;
      i < filas.length;
      i++
    ) {

      const fila =
        filas[i];


      /*
        Ignoramos filas completamente vacías.
      */

      if (
        fila.every(
          valor =>
            String(valor ?? "").trim() === ""
        )
      ) {

        continue;

      }


      const datos =
        convertirFilaExcel(
          fila,
          indices
        );


      /*
        Si no hay ubicación ni
        ningún dato relevante,
        no creamos cartel.
      */

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
        Si la fila tiene datos pero
        falta algún campo obligatorio,
        no la importamos.
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

        id: generarId(),

        ...datos

      });

    }


    if (nuevos.length === 0) {

      throw new Error(
        "No se encontraron filas válidas para crear carteles."
      );

    }


    /*
      Añadimos los nuevos carteles
      a los que ya existen.
    */

    const anteriores =
      carteles;


    carteles =
      [
        ...carteles,
        ...nuevos
      ];


    if (!guardarCarteles()) {

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
    i < Math.min(filas.length, 20);
    i++
  ) {

    const fila =
      filas[i]
        .map(
          valor =>
            normalizarTexto(
              valor
            )
        );


    const tieneAnada =
      fila.includes("anada");


    const tieneColor =
      fila.includes("color");


    const tieneCalificacion =
      fila.includes("calificacion");


    const tieneCantidad =
      fila.includes("cantidad");


    const tieneUbicacion =
      fila.includes("ubicacion");


    const tieneVariedades =
      fila.includes("variedades");


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


    if (indice !== -1) {
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
    valor(indices.anada);


  const colorExcel =
    valor(indices.color);


  const calificacionExcel =
    valor(indices.calificacion);


  const cantidad =
    valor(indices.cantidad);


  const unidad =
    valor(indices.unidad);


  const ubicacion =
    valor(indices.ubicacion);


  const variedades =
    valor(indices.variedades);


  return {

    /*
      Ubicación pasa a ser
      DEPÓSITO / BARRICAS.
    */

    deposito:
      ubicacion,


    /*
      Cantidad + unidad.

      Ejemplo:
      10500 + L
      = 10500 L
    */

    litros:
      cantidad +
      (
        unidad
          ? " " + unidad
          : ""
      ),


    anada:
      anadaValor,


    /*
      Convertimos el color del Excel
      a uno de los cuatro valores
      admitidos por la aplicación.
    */

    tipoVino:
      convertirTipoVino(
        colorExcel
      ),


    /*
      Convertimos la calificación
      del Excel a las opciones
      de la aplicación.
    */

    calificacion:
      convertirCalificacion(
        calificacionExcel
      ),


    variedad:
      variedades

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

    return "Tinto";

  }


  if (
    texto === "blanco" ||
    texto.includes("blanco")
  ) {

    return "Blanco";

  }


  if (
    texto === "rosado" ||
    texto === "rosado"
  ) {

    return "Rosado";

  }


  return "Otros";

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
    texto.includes("toro")
  ) {

    return "D.O. TORO";

  }


  if (
    texto.includes("vtcyl") ||
    texto.includes("vtcyl")
  ) {

    return "VTCYL";

  }


  if (
    texto.includes("mesa") ||
    texto.includes("sin igp")
  ) {

    return "VINOS DE MESA (Sin IGP)";

  }


  /*
    Si aparece una calificación
    desconocida no inventamos otra.
    La importación la tratará como
    VINOS DE MESA.
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
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}


/* =========================================================
   INICIO
========================================================= */

actualizarVistaPrevia();

dibujarLista();

actualizarControles();