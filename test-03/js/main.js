// Función para cargar preguntas desde un archivo XML
function cargarPreguntas() {
    fetch('data.xml') // Asegúrate de que la ruta sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo XML');
            }
            return response.text();
        })
        .then(data => {
            const preguntas = parseXML(data);
            mostrarPreguntas(preguntas);
        })
        .catch(error => {
            console.error("Error al cargar el archivo XML:", error);
        });
}

// Función para analizar el XML y extraer preguntas
function parseXML(data) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const cuestionarios = xmlDoc.getElementsByTagName("cuestionario");

    return Array.from(cuestionarios).map(cuestionario => ({
        titulo: cuestionario.getElementsByTagName("titulo")[0].textContent,
        opciones: Array.from(cuestionario.getElementsByTagName("opcion")).map(opcion => ({
            texto: opcion.textContent,
            id: opcion.getAttribute("id")
        })),
        correcta: cuestionario.getElementsByTagName("correcta")[0].textContent
    }));
}

// Función para mostrar las preguntas en el DOM
function mostrarPreguntas(preguntas) {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Limpia el contenedor
    shuffle(preguntas);

    preguntas.forEach((pregunta, index) => {
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
    });
}

// Función para mezclar (aleatorizar) un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
