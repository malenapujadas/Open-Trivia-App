const dificultad = localStorage.getItem("dificultadSeleccionada");
const categoria = localStorage.getItem("categoriaSeleccionada");

let url = `https://opentdb.com/api.php?amount=10&difficulty=${dificultad}&type=multiple`;

if (categoria) {
    url += `&category=${categoria}`;
}

fetch(url)
    .then((respuesta) => respuesta.json())
    .then((res) => {
        /* console.log(res) */
        let html = ""; //genero una variable html y voy poniendo ahi toda la data digamos 
        let index = 1; //variable para indicar el numero de la pregunta
        const respuestasCorrectas = []; //array para guardar las rtas correctas 
        let h1 = document.querySelector("h1");
        h1.innerText = `Level: ${dificultad.charAt(0).toUpperCase() + dificultad.slice(1)}`;



        // Mostrar mejor puntaje
        const clavePuntaje = `mejorPuntaje_${dificultad}`;
        const mejorPuntaje = localStorage.getItem(clavePuntaje);

        if (mejorPuntaje !== null) {
            const mejorPuntajeElemento = document.createElement("h2");
            mejorPuntajeElemento.innerText = `🏆 Best Score (${dificultad}): ${mejorPuntaje}/10`;
            mejorPuntajeElemento.style.textAlign = "center";
            h1.insertAdjacentElement("afterend", mejorPuntajeElemento);
        }

        
        for (const pregunta of res.results) {
            /* console.log(pregunta); */
            //concateno las respuestas incorrectas con la correcta para tener todo en una constante
            const todasLasRespuestas = [pregunta.correct_answer].concat(pregunta.incorrect_answers);
            //las mezclo para mandarlas en cualquier orden y q no me quede siempre la rta correcta primera
            const respuestasMezcladas = todasLasRespuestas.sort(() => Math.random() - 0.5);
            //pusheo las rtas correctas al array, esto me va a servir para despues hacer la comparacion de lo q selecciono el usuario
            respuestasCorrectas.push(pregunta.correct_answer);
            
            //teoricamente, entiendo q deberia hacer un for each por cada rta, y pasarle las respuestas mezcladas con su lenght pero no se como agregar js en este html 
            html += `
        <div>
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-body">
                <h5 class="card-title">Question ${index}</h5>
                <p class="card-text">${pregunta.question}</p>
                <div><strong>Choose your answer:</strong> 
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="pregunta-${index}" value="${respuestasMezcladas[0]}" id="respuesta-${index}-0">
                    <label class="form-check-label" for="flexCheckDefault">
                    ${respuestasMezcladas[0]}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="pregunta-${index}" value="${respuestasMezcladas[1]}" id="respuesta-${index}-0">
                    <label class="form-check-label" for="flexCheckDefault">
                    ${respuestasMezcladas[1]}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="pregunta-${index}" value="${respuestasMezcladas[2]}" id="respuesta-${index}-0">
                    <label class="form-check-label" for="flexCheckDefault">
                    ${respuestasMezcladas[2]}
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="pregunta-${index}" value="${respuestasMezcladas[3]}" id="respuesta-${index}-0">
                    <label class="form-check-label" for="flexCheckDefault">
                    ${respuestasMezcladas[3]}
                    </label>
                </div>
            </div>
            </div>
        </div>
        `;
            index++ //para aumentar el numero de la pregunta
            console.log(pregunta.correct_answer);
            
        }
        // selecciono el div y agrego el html
        document.getElementById("pregunta-container").innerHTML = html
        

        //*****logica para comparar respuesta correcta y seleccionada para generar puntos

        //creo el boton
        const divFinalizar = document.createElement("div");
        divFinalizar.className = "divFinalizar";
        const botonFinalizar = document.createElement("button");
        botonFinalizar.textContent = "Finish and see score";
        botonFinalizar.className = "finalizar";

        //evento para escuchar el boton
        botonFinalizar.addEventListener("click", () => {
        let puntaje = 0;

        //bucle para recorrer preguntas y comparar la seleccionada x el usuario
        for (let i = 1; i <= 10; i++) {
            //selecciono todos los botones de la pregunta i (1, 2,3 o 4) que fueron seleccionados (checked)
            const seleccionada = document.querySelector(`input[name="pregunta-${i}"]:checked`);
            //condicional para comparar la rta seleccionada con la rta correcta. Tmb pongo el seleccionda x si el usuario no selecciono nd. Le resto 1 porque el index va desde 0 y mis preguntas arrancan en 1
            if (seleccionada && seleccionada.value === respuestasCorrectas[i - 1]) {
                puntaje++;
            }
        }

        // guardo puntaje más alto
        const clavePuntaje = `mejorPuntaje_${dificultad}`;
        const puntajeAlmacenado = localStorage.getItem(clavePuntaje);
        const mejorPuntaje = puntajeAlmacenado ? parseInt(puntajeAlmacenado) : 0;

        if (puntaje > mejorPuntaje) {
            localStorage.setItem(clavePuntaje, puntaje);
        }

        //  NOTIFICACIÓN si no sacó 10
        if (Notification.permission === "granted" && puntaje < 10) {
            new Notification("¡Podés mejorar!", {
                body: `Tu puntaje fue ${puntaje}/10. ¿Querés volver a intentarlo?`,
                icon: "icons/logo.png"
            });
        }

        //limpiar pantalla y mostrar solo puntaje obtenido y el mas alto
        const main = document.querySelector("main");
        main.innerHTML = `
        <h1>Your score is ${puntaje}/10</h1>
        <h2>🏆 Your highest score is: ${Math.max(puntaje, mejorPuntaje)}/10</h2>
        <div class="divFinalizar">
            <button class="finalizar" id="reintentar">Volver a intentar</button>
        </div>
    `;
        //reintentar mismo nivel
        document.getElementById("reintentar").addEventListener("click", () => {
            window.location.reload(); // vuelve a ejecutar el fetch del mismo nivel
        });
    });

    document.getElementById("pregunta-container").appendChild(divFinalizar);
    divFinalizar.appendChild(botonFinalizar);
    })
    .catch(error => console.log('error', error));

    //comprobar si esta offline
    window.addEventListener("DOMContentLoaded", () => {
    if (!navigator.onLine) {
        document.body.classList.add("offline-mode");
    }

    // para detectar si se desconecta o reconecta después
    window.addEventListener("online", () => {
        document.body.classList.remove("offline-mode");
    });

    window.addEventListener("offline", () => {
        document.body.classList.add("offline-mode");
    });
});



