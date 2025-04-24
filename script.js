document.getElementById('search-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    document.querySelectorAll('.ofert-1').forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();

        // Mostrar todos si el input está vacío
        if (searchTerm === '') {
            product.style.display = 'block';
        } else {
            product.style.display = title.includes(searchTerm) ? 'block' : 'none';
        }
    });
});


// Breadcrumb dinámico
document.addEventListener('DOMContentLoaded', function() {
    const breadcrumbContainer = document.getElementById('breadcrumb');
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const sectionId = window.location.hash.substring(1) || '';
    
    // Mapeo de nombres amigables
    const pageNames = {
        'index': 'Inicio',
        'promociones': 'Promociones'
    };
    
    const sectionNames = {
        'ofertas': 'Ofertas',
        'lista-1': 'Recomendados',
        'lista-2': 'Productos',
        'Perros': 'Perros',
        'Gatos': 'Gatos',
        'Blog': 'Blog',
        'contacto': 'Contacto',
        'Promociones': 'Promociones'
    };
    
    // Construir el breadcrumb
    let breadcrumbHTML = `<a href="index.html">${pageNames['index']}</a>`;
    
    // Si no es la página de inicio
    if (currentPage !== 'index') {
        breadcrumbHTML += ` > <a href="${currentPage}.html">${pageNames[currentPage] || currentPage}</a>`;
    }
    
    // Si hay una sección específica
    if (sectionId && sectionNames[sectionId]) {
        breadcrumbHTML += ` > <span>${sectionNames[sectionId]}</span>`;
    }
    
    // Insertar en el DOM
    breadcrumbContainer.innerHTML = breadcrumbHTML;
    
    // Actualizar al hacer clic en enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(updateBreadcrumb, 100); // Pequeño delay para que se complete la navegación
        });
    });
    
    // Función para actualizar el breadcrumb
    function updateBreadcrumb() {
        const newSectionId = window.location.hash.substring(1);
        let newBreadcrumb = `<a href="index.html">${pageNames['index']}</a>`;
        
        if (currentPage !== 'index') {
            newBreadcrumb += ` > <a href="${currentPage}.html">${pageNames[currentPage] || currentPage}</a>`;
        }
        
        if (newSectionId && sectionNames[newSectionId]) {
            newBreadcrumb += ` > <span>${sectionNames[newSectionId]}</span>`;
        }
        
        breadcrumbContainer.innerHTML = newBreadcrumb;
    }
    
    // Actualizar también al navegar con los botones del navegador
    window.addEventListener('hashchange', updateBreadcrumb);
});

// anadir productos al carrito 

document.addEventListener('DOMContentLoaded', function() {
    const carrito = document.getElementById('carrito');
    const lista = document.querySelector('#lista-carrito tbody');
    const vaciarcarritoBtn = document.getElementById('vaciar-carrito');
    const totalElement = document.createElement('div'); // Elemento para mostrar el total
    totalElement.id = 'total-carrito';
    totalElement.style.fontWeight = 'bold';
    totalElement.style.marginTop = '10px';
    totalElement.style.padding = '10px';
    totalElement.style.backgroundColor = '#f5f5f5';
    totalElement.style.borderRadius = '5px';
    carrito.appendChild(totalElement);

    // Cargar carrito desde localStorage si existe
    cargarCarrito();

    function cargarEventListeners() {
        // Escuchar clicks en todo el documento para botones 'agregar-carrito'
        document.addEventListener('click', function(e) {
            if(e.target.classList.contains('agregar-carrito')) {
                e.preventDefault();
                const elemento = e.target.closest('.ofert-1');
                if(elemento) {
                    leerDatosElemento(elemento);
                }
            }
        });

        carrito.addEventListener('click', eliminarElemento);
        vaciarcarritoBtn.addEventListener('click', vaciarCarrito);
    }

    function leerDatosElemento(elemento) {
        const infoElemento = {
            imagen: elemento.querySelector('img').src,
            titulo: elemento.querySelector('h3').textContent,
            precio: elemento.querySelector('.precio').textContent,
            id: elemento.querySelector('a').getAttribute('data-id')
        };
        insertarCarrito(infoElemento);
        guardarCarrito();
        actualizarTotal();
    }

    function insertarCarrito(elemento) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${elemento.imagen}" width=100></td>
            <td>${elemento.titulo}</td>
            <td class="precio-producto">${elemento.precio}</td>
            <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
        `;
        lista.appendChild(row);
    }

    function eliminarElemento(e) {
        e.preventDefault();
        if(e.target.classList.contains('borrar')) {
            e.target.parentElement.parentElement.remove();
            guardarCarrito();
            actualizarTotal();
        }
    }

    function vaciarCarrito() {
        while(lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
        localStorage.removeItem('carrito');
        actualizarTotal();
        return false;
    }

    // Función para calcular y mostrar el total
    function actualizarTotal() {
        const precios = document.querySelectorAll('.precio-producto');
        let total = 0;
        
        precios.forEach(precioElement => {
            // Extraer el valor numérico del precio (elimina símbolos como $ y .)
            const precioTexto = precioElement.textContent;
            const precioNumero = parseFloat(precioTexto.replace(/[^0-9.-]+/g,""));
            
            if(!isNaN(precioNumero)) {
                total += precioNumero;
            }
        });
        
        // Formatear el total como moneda
        totalElement.textContent = `Total: $${total.toLocaleString('es-CO')}`;
        
        // Ocultar si no hay productos
        if(precios.length === 0) {
            totalElement.textContent = '';
        }
    }

    // Guardar carrito en localStorage
    function guardarCarrito() {
        const filas = lista.querySelectorAll('tr');
        const carrito = [];
        
        filas.forEach(fila => {
            const elemento = {
                imagen: fila.querySelector('img').src,
                titulo: fila.querySelector('td:nth-child(2)').textContent,
                precio: fila.querySelector('.precio-producto').textContent,
                id: fila.querySelector('.borrar').getAttribute('data-id')
            };
            carrito.push(elemento);
        });
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Cargar carrito desde localStorage
    function cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        if(carritoGuardado) {
            const carrito = JSON.parse(carritoGuardado);
            carrito.forEach(elemento => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${elemento.imagen}" width=100></td>
                    <td>${elemento.titulo}</td>
                    <td class="precio-producto">${elemento.precio}</td>
                    <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
                `;
                lista.appendChild(row);
            });
            actualizarTotal();
        }
    }

    cargarEventListeners();
});

// autenticacion 

// Referencias a los botones
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');

// Configuración de proveedores (Google, Email, etc.)
const googleProvider = new firebase.auth.GoogleAuthProvider();

// ===== REGISTRO CON GOOGLE =====
registerBtn.addEventListener('click', () => {
  firebase.auth().signInWithPopup(googleProvider)
    .then((result) => {
      console.log("Usuario registrado:", result.user);
    })
    .catch((error) => {
      console.error("Error en registro:", error);
      alert("Error al registrarse: " + error.message);
    });
});

// ===== LOGIN CON GOOGLE =====
loginBtn.addEventListener('click', () => {
  firebase.auth().signInWithPopup(googleProvider)
    .then((result) => {
      console.log("Usuario logueado:", result.user);
    })
    .catch((error) => {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión: " + error.message);
    });
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => {
      console.log("Sesión cerrada");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
});

// ===== OBSERVADOR DE AUTENTICACIÓN =====
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Usuario logueado: ocultar login/register, mostrar logout y nombre
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    userNameSpan.style.display = 'inline';
    userNameSpan.textContent = user.displayName || user.email.split('@')[0];
    
    // Guardar usuario en localStorage (opcional)
    localStorage.setItem('currentUser', JSON.stringify({
      uid: user.uid,
      name: user.displayName,
      email: user.email
    }));
  } else {
    // Usuario NO logueado: mostrar login/register, ocultar logout
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    userNameSpan.style.display = 'none';
    localStorage.removeItem('currentUser');
  }
});


async function cargarRecomendaciones(tipoMascota) {
    try {
      const response = await fetch(`http://localhost:3002/api/recomendaciones/${tipoMascota}`);
      const data = await response.json();
      
      const contenedor = document.getElementById('recomendaciones-container');
      contenedor.innerHTML = data.map(item => `
        <div class="recomendacion">
          <p>⭐ ${item}</p>
        </div>
      `).join('');
    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
    }
  }
  
  // Ejecutar al hacer clic en secciones
  document.querySelector('#Perros').addEventListener('click', () => cargarRecomendaciones('perros'));
  document.querySelector('#Gatos').addEventListener('click', () => cargarRecomendaciones('gatos'));