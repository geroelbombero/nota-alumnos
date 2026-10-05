
const maxAlumnos = 10;
const notaAprobacion = 55;

const nombres = [];


const notas = [];

const formulario = document.getElementById("formularioAlumno");
const inputNombre = document.getElementById("nombre");
const inputCertamen1 = document.getElementById("certamen1");
const inputCertamen2 = document.getElementById("certamen2");
const inputCertamen3 = document.getElementById("certamen3");
const botonAgregar = document.getElementById("botonAgregar");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const seccionResultados = document.getElementById("resultados");
const listaAlumnos = document.getElementById("listaAlumnos");
const resumenCurso = document.getElementById("resumenCurso");
const ranking = document.getElementById("ranking");

function mostrarError(texto) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje error";
}

function mostrarExito(texto) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje exito";
}

function notaEsValida(textoNota) {
  if (textoNota.trim() === "") {
    return false;
  }
  const nota = Number(textoNota);
  if (isNaN(nota)) {
    return false;
  }
  if (nota < 0 || nota > 100) {
    return false;
  }
  return true;
}

function validarDatos(nombre, texto1, texto2, texto3) {
  if (nombre === "") {
    return "El nombre no puede estar vacío.";
  }
  if (!isNaN(nombre)) {
    return "El nombre no puede ser solo un número.";
  }
  if (nombre.includes("<") || nombre.includes(">")) {
    return "El nombre no puede contener los símbolos < o >.";
  }
  if (!notaEsValida(texto1)) {
    return "El Certamen 1 debe ser un número entre 0 y 100.";
  }
  if (!notaEsValida(texto2)) {
    return "El Certamen 2 debe ser un número entre 0 y 100.";
  }
  if (!notaEsValida(texto3)) {
    return "El Certamen 3 debe ser un número entre 0 y 100.";
  }
  return "";
}

function calcularPromedio(lista) {
  const suma = lista.reduce(function (acumulado, numero) {
    return acumulado + numero;
  }, 0);
  return suma / lista.length;
}

function obtenerPromediosAlumnos() {
  return notas.map(function (filaNotas) {
    return calcularPromedio(filaNotas);
  });
}

function obtenerPromedioCertamen(indiceCertamen) {
  const columna = notas.map(function (filaNotas) {
    return filaNotas[indiceCertamen];
  });
  return calcularPromedio(columna);
}

function contarAprobados(promedios) {
  const aprobados = promedios.filter(function (promedio) {
    return promedio >= notaAprobacion;
  });
  return aprobados.length;
}

function contarReprobados(promedios) {
  const reprobados = promedios.filter(function (promedio) {
    return promedio < notaAprobacion;
  });
  return reprobados.length;
}

function ordenarAlumnos(promedios) {
  const lista = nombres.map(function (nombre, indice) {
    return { nombre: nombre, promedio: promedios[indice] };
  });

  lista.sort(function (a, b) {
    return b.promedio - a.promedio;
  });

  return lista;
}

function mostrarAlumnos(promedios) {
  let html = "";

  for (let i = 0; i < nombres.length; i++) {
    let clase = "reprobado";
    if (promedios[i] >= notaAprobacion) {
      clase = "aprobado";
    }

    html += '<div class="alumno">';
    html += "<p><strong>Nombre " + (i + 1) + ":</strong> " + nombres[i] + "</p>";
    html += "<p>C1: " + notas[i][0] + "</p>";
    html += "<p>C2: " + notas[i][1] + "</p>";
    html += "<p>C3: " + notas[i][2] + "</p>";
    html += '<p>Promedio: <span class="' + clase + '">' + promedios[i].toFixed(2) + "</span></p>";
    html += "</div>";
  }

  listaAlumnos.innerHTML = html;
}

function mostrarResumenCurso(promedios) {
  const promedioC1 = obtenerPromedioCertamen(0);
  const promedioC2 = obtenerPromedioCertamen(1);
  const promedioC3 = obtenerPromedioCertamen(2);
  const promedioFinal = calcularPromedio(promedios);
  const aprobados = contarAprobados(promedios);
  const reprobados = contarReprobados(promedios);

  let html = '<div class="resumen">';
  html += "<h3>Resumen del curso</h3>";
  html += "<p>Promedio del curso C1: " + promedioC1.toFixed(2) + "</p>";
  html += "<p>Promedio del curso C2: " + promedioC2.toFixed(2) + "</p>";
  html += "<p>Promedio del curso C3: " + promedioC3.toFixed(2) + "</p>";
  html += "<p>Promedio Final Curso: " + promedioFinal.toFixed(2) + "</p>";
  html += "<p>Aprobados: " + aprobados + "</p>";
  html += "<p>Reprobados: " + reprobados + "</p>";
  html += "</div>";

  resumenCurso.innerHTML = html;
}

function mostrarRanking(promedios) {
  const listaOrdenada = ordenarAlumnos(promedios);

  let html = "<h3>Alumnos ordenados por promedio</h3>";
  html += "<ol>";
  for (let i = 0; i < listaOrdenada.length; i++) {
    html += "<li>" + listaOrdenada[i].nombre + " - " + listaOrdenada[i].promedio.toFixed(2) + "</li>";
  }
  html += "</ol>";

  ranking.innerHTML = html;
}

function mostrarResultados() {
  const promedios = obtenerPromediosAlumnos();

  mostrarAlumnos(promedios);
  mostrarResumenCurso(promedios);
  mostrarRanking(promedios);

  seccionResultados.classList.remove("oculto");
}

function agregarAlumno(evento) {
  evento.preventDefault();

  if (nombres.length >= maxAlumnos) {
    mostrarError("Ya se registraron los 10 alumnos del curso.");
    return;
  }

  const nombre = inputNombre.value.trim();
  const texto1 = inputCertamen1.value;
  const texto2 = inputCertamen2.value;
  const texto3 = inputCertamen3.value;

  const error = validarDatos(nombre, texto1, texto2, texto3);
  if (error !== "") {
    mostrarError(error);
    return;
  }

  nombres.push(nombre);
  notas.push([Number(texto1), Number(texto2), Number(texto3)]);

  mostrarResultados();
  mostrarExito("Alumno " + nombre + " agregado correctamente.");

  contador.textContent = "Alumnos registrados: " + nombres.length + " de " + maxAlumnos;
  formulario.reset();
  inputNombre.focus();

  if (nombres.length === maxAlumnos) {
    botonAgregar.disabled = true;
    mostrarExito("Se registraron los 10 alumnos. Revisa los resultados abajo.");
  }
}

formulario.addEventListener("submit", agregarAlumno);