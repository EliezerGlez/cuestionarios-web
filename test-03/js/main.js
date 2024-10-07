let preguntas = []; // Mueve la declaración aquí para que sea global

function cargarPreguntas() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Limpia el contenedor

    fetch('data.xml') // Ajusta la ruta a 'data.xml' ya que está en el mismo nivel que index.html
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
                opciones: Array.from(cuestionario.getElementsByTagName("opciones")[0].getElementsByTagName("opcion")).map(opcion => ({
                    texto: opcion.textContent,
                    id: opcion.getAttribute("id")
                })),
                correcta: cuestionario.getElementsByTagName("correcta")[0].textContent
            }));

            shuffle(preguntas); // Mezcla las preguntas

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
                    li.classList.add("opcion");

                    const label = document.createElement("label");
                    label.textContent = opcion.texto;
                    label.setAttribute("data-id", opcion.id);
                    label.onclick = () => seleccionarOpcion(label, index); // Agregar evento de clic

                    li.appendChild(label);
                    opcionesList.appendChild(li);
                });

                preguntaDiv.appendChild(opcionesList);
                quizContainer.appendChild(preguntaDiv);
            });
        })
        .catch(error => {
            console.error("Error al cargar el archivo XML:", error);
        });
}

// Función para seleccionar la opción al hacer clic
function seleccionarOpcion(label, index) {
    const opciones = document.querySelectorAll(`.opciones li label`);
    opciones.forEach(opcion => {
        opcion.classList.remove("seleccionada"); // Eliminar la clase seleccionada de todas las opciones
    });
    label.classList.add("seleccionada"); // Añadir la clase seleccionada a la opción clicada
    const idSeleccionado = label.getAttribute("data-id");
    document.querySelector(`input[name="pregunta-${index}"]`).value = idSeleccionado; // Actualiza el valor del radio button
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
