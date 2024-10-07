// Preguntas con opciones y respuestas correctas
const preguntas = [
    {
        titulo: "CAC 2010 Veter. A2 - 104.-) El derecho a la producción técnica ¿cuándo puede restringirse mediante censura previa?",
        opciones: [
            { texto: "Nunca.", id: "a" },
            { texto: "Por resolución judicial.", id: "b" },
            { texto: "Solo en los casos previstos en las leyes.", id: "c" },
            { texto: "Solo en el caso previsto en la Constitución.", id: "d" }
        ],
        correcta: "a"
    },
    {
        titulo: "ORO.. CAC 2010 Veter. A2 - 5.-) ¿Cuál de los siguientes no es un derecho fundamental?",
        opciones: [
            { texto: "El derecho a participar en los asuntos públicos por medio de representantes.", id: "a" },
            { texto: "El derecho de petición colectiva efectuado por miembros de las fuerzas armadas.", id: "b" },
            { texto: "El derecho a no ser enjuiciado por un Tribunal de Honor en el ámbito de una organización profesional.", id: "c" },
            { texto: "El derecho a la educación.", id: "d" }
        ],
        correcta: "b"
    },
    {
        titulo: "ORO.. A2 TL AGE 09 - 904.-) De acuerdo con la Constitución, señale cuál de los siguientes derechos podrá ser objeto de suspensión cuando se declaren los estados de excepción o sitio:",
        opciones: [
            { texto: "Derecho a la inviolabilidad del domicilio (art 18.2 CE).", id: "a" },
            { texto: "Derecho a la producción y creación literaria (art 20.1.b CE).", id: "b" },
            { texto: "Derecho de asociación (art 22.1 CE).", id: "c" },
            { texto: "Derecho a la educación (art 27.1 CE).", id: "d" }
        ],
        correcta: "a"
    }
];

// Función para mezclar (aleatorizar) las preguntas y opciones
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Cargar las preguntas en el DOM
function cargarPreguntas() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; 
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
