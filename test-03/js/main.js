// main.js

let preguntas = []; // Variable global para almacenar las preguntas
let preguntaActual = 0; // Variable para rastrear la pregunta actual

// Función para mezclar (aleatorizar) un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para cargar preguntas desde el archivo XML
function cargarPreguntas() {
    const quizContainer = document.getElementById("quiz");
    const resultadoDiv = document.getElementById("resultado");

    // Mostrar un mensaje de carga
    resultadoDiv.textContent = "Cargando preguntas...";

    fetch('data.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo XML');
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");
            const cuestionarios = xmlDoc.getElementsByTagName("cuestionario");

            preguntas = Array.from(cuestionarios).map(cuestionario => ({
                titulo: cuestionario.getElementsByTagName("titulo")[0].textContent,
                opciones: Array.from(cuestionario.getElementsByTagName("opcion")).map(opcion => ({
                    texto: opcion.textContent,
                    id: opcion.getAttribute("id")
                })),
                correcta: cuestionario.getElementsByTagName("correcta")[0].textContent
            }));

            // Mezclar las preguntas y mostrar la primera
            shuffle(preguntas);
            mostrarPregunta(preguntaActual);
            resultadoDiv.textContent = ""; // Limpiar el mensaje de carga
        })
        .catch(error => {
            console.error("Error al cargar el archivo XML:", error);
            resultadoDiv.textContent = "Error al cargar las preguntas.";
        });
}

// Función para mostrar la pregunta actual en el DOM
function mostrarPregunta(index) {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Limpiar el contenedor

    const pregunta = preguntas[index];
    const preguntaDiv = document.createElement("div");
    preguntaDiv.classList.add("pregunta-container");

    const titulo = document.createElement("h2");
    titulo.textContent = `${index + 1}. ${pregunta.titulo}`;
    preguntaDiv.appendChild(titulo);

    const opcionesList = document.createElement("ul");
    opcionesList.classList.add("opciones");

    const opciones = [...pregunta.opciones];
    shuffle(opciones);
    
    opciones.forEach(opcion => {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `pregunta-${index}`;
        input.value = opcion.id;
        input.id = `pregunta-${index}-${opcion.id}`;

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = opcion.texto;

        li.appendChild(input);
        li.appendChild(label);
        opcionesList.appendChild(li);
    });

    preguntaDiv.appendChild(opcionesList);
    quizContainer.appendChild(preguntaDiv);

    // Actualizar botones de navegación
    actualizarBotones();
}

// Función para actualizar la visibilidad de los botones
function actualizarBotones() {
    const btnSiguiente = document.getElementById("btn-siguiente");
    const btnAnterior = document.getElementById("btn-anterior");

    // Solo actualizar los botones si existen
    if (btnSiguiente && btnAnterior) {
        btnSiguiente.style.display = preguntaActual === preguntas.length - 1 ? "none" : "inline-block";
        btnAnterior.style.display = preguntaActual === 0 ? "none" : "inline-block";
    }
}

// Función para ir a la siguiente pregunta
function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta(preguntaActual);
    }
}

// Función para ir a la pregunta anterior
function anteriorPregunta() {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta(preguntaActual);
    }
}

// Función para verificar las respuestas seleccionadas
function checkAnswers() {
    let score = 0;
    preguntas.forEach((pregunta, index) => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta-${index}"]:checked`);
        if (respuestaSeleccionada && respuestaSeleccionada.value === pregunta.correcta) {
            score++;
        }
    });

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.textContent = `Has acertado ${score} de ${preguntas.length} preguntas.`;
}

// Inicializa el cuestionario
cargarPreguntas();
