let preguntas = [];
let preguntaActual = 0;

function cargarPreguntas() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; 

    fetch('data.xml') // Ajusta la ruta a tu archivo XML
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

            mostrarPregunta();
        })
        .catch(error => {
            console.error("Error al cargar el archivo XML:", error);
        });
}

function mostrarPregunta() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Limpia el contenedor

    const pregunta = preguntas[preguntaActual];
    const preguntaDiv = document.createElement("div");
    preguntaDiv.classList.add("pregunta-container");

    const titulo = document.createElement("h2");
    titulo.textContent = `${preguntaActual + 1}. ${pregunta.titulo}`;
    preguntaDiv.appendChild(titulo);

    const opcionesList = document.createElement("ul");
    opcionesList.classList.add("opciones");

    pregunta.opciones.forEach(opcion => {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `pregunta-${preguntaActual}`;
        input.value = opcion.id;
        input.id = `pregunta-${preguntaActual}-${opcion.id}`;

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = opcion.texto;

        li.appendChild(input);
        li.appendChild(label);
        opcionesList.appendChild(li);
    });

    preguntaDiv.appendChild(opcionesList);
    quizContainer.appendChild(preguntaDiv);

    actualizarBotones();
}

function actualizarBotones() {
    document.getElementById("btnAnterior").style.display = preguntaActual === 0 ? 'none' : 'inline';
    document.getElementById("btnSiguiente").style.display = preguntaActual === preguntas.length - 1 ? 'none' : 'inline';
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        mostrarPregunta();
    }
}

function anteriorPregunta() {
    if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta();
    }
}

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
