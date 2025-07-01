
window.addEventListener("DOMContentLoaded", function () { //con el DOMContentLoaded hacemos que primero se cargue el dom antes de ejecutar la funcion 
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js')
            .then(respuesta => console.log('se registro correctamente'))
            .catch(error => console.log('no se pudo registrar'))
    }

})

//compartir
const btnShare = document.querySelector('.btnShare');

if (navigator.share) {
    btnShare.addEventListener('click', () => {
        const dataShare = {
            title: "Ultimate Trivia Challenge",
            text: "Put your knowledge to the test in this fast-paced trivia game!",
            url: location.href 
        };
        navigator.share(dataShare)
            .then(() => console.log("Contenido compartido"))
            .catch(err => console.error("Error al compartir", err));
    });
} else {
    console.log("La Web Share API no está disponible");
    btnShare.style.display = 'none';
}


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


document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
    const dificultad = btn.getAttribute("data-dificultad");
    const categoria = document.getElementById("categoria").value;

    localStorage.setItem("dificultadSeleccionada", dificultad);
    localStorage.setItem("categoriaSeleccionada", categoria);

    window.location.href = "juego.html";
});
});

//funcionalidad para boton instalar 
let deferredPrompt; // para guardar el evento

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // prevenimos el comportamiento por defecto
    deferredPrompt = e; // lo guardamos para usarlo después

    // Mostramos el botón de instalar
    const btn = document.getElementById('instalarApp');
    btn.classList.remove('d-none'); // lo mostramos

    btn.addEventListener('click', () => {
        btn.classList.add('d-none'); // lo escondo luego de clic
        deferredPrompt.prompt(); // lanzo el popup de instalación

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('El usuario aceptó la instalación');
            } else {
                console.log('El usuario rechazó la instalación');
            }
            deferredPrompt = null; // ya no necesitamos guardarlo
        });
    });
});

/* NOTIFICACIONES */

// Pedir permiso automáticamente al iniciar
if ("Notification" in window && Notification.permission !== "granted") {
    setTimeout(() => {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("✅ Notificaciones activadas");
            } else {
                console.log("❌ Usuario rechazó las notificaciones");
            }
        });
    }, 1500);
}

// Notificación manual desde botón
const buttonNotif = document.querySelector('.btnNotif');
if (buttonNotif) {
    buttonNotif.addEventListener("click", () => {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Trivia Challenge", {
                    body: "¿Te animás a mejorar tu puntaje?",
                    icon: "icons/logo.png",
                    tag: "recordatorio"
                });
            }
        });
    });
}