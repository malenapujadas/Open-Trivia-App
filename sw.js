const cacheName = 'trivia';
const assets = [
    "/",
    "index.html",
    "script.js"
]

self.addEventListener('install', (event) => {//llamamos al evento de instalacion
    console.log("sw instalado")
    event.waitUntil(//con este metodo le decimos que espere a lo que esta entre parentesis, que le vamos a decir que se cree ese cache si no existe
        caches.open(cacheName) //API nativa de JS para trabajar todo lo relacionado con el guardado de caches. Con el metodo open si ya existe lo q le paso x parentesis lo abre y sino lo crea y lo abre. Este metodo devuevle una promesa
        .then(cache => {
            cache.addAll(assets) //a ese cache que me abrio, le agrego todo lo q tengo en assets
        })
        
    )
})

self.addEventListener('activate', () => { 
    console.log("sw activado")
    
})

self.addEventListener('fetch',(event) => {
    event.respondWith(
        caches.match(event.request) //lo que hago aca es preguntarle sis hay match con lo que estoy solicitano en el cache, si hay seguimos y si no no, por ende me devuelve una promesa
        .then((res) => {
            if(res){ //si devolvio algo (osea que lo encontro), le retorno eso 
                return res;
            }
            //caso si fue al cache y no lo encontro, por ende debo ir al servidor, buscar y devolver la rta, por esto genero un nuevo fetch 
            //con esta nueva peticion que voy a hacer, voy a querer tomar dos acciones: por un lado, tengo que ir a bsucar el recurso y dar una respuesta, pero por otro lado quiero guardar ese recurso en el cache. Por ende, lo voy a usar en dos instancias, lo cual el request no puede xq s puede usar para un solo recurso
            let requestToCache = event.request.clone(); //clono el request asi lo uso para mas de una cosa
            return fetch(requestToCache)
            .then((res) => {
                //puede llegar a pasar de que voy a solicitarlo y hubo un problema y no me lo pudo devolver
                if(!res || res.status !== 200){
                    //opcion para el error
                    return res; //esto despues lo vamos a tunear para q mande un mensaje a error
                }
                //si no entro en el error, quiere decir que la rta fue exitosa, asique vamos a clonar la rta y la guardamos en cache y la devolvemos
                let responseToCache = res.clone();
                caches.open(cacheName)
                .then(cache => {
                    cache.put(requestToCache, responseToCache)
                })
                return res;

            })
        })
    )
})