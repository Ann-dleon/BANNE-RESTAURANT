// ===============================================
// NAVEGACION Y CAMBIO DE SECCIONES
// ===============================================

function mostrarSeccion(idSeccion) {
    const hero = document.getElementById('hero-banner');
    const tarjetas = document.getElementById('tarjetas-inicio');
    const seccionReserva = document.getElementById('seccion-reserva');
    const seccionMenu = document.getElementById('seccion-menu-solo');
    const seccionPedido = document.getElementById('seccion-pedido');
    const seccionContacto = document.getElementById('seccion-contacto');
    const seccionResenas = document.getElementById('seccion-resenas');
    
    hero.style.display = 'none';
    if (tarjetas) tarjetas.style.display = 'none';
    seccionReserva.style.display = 'none';
    seccionMenu.style.display = 'none';
    seccionPedido.style.display = 'none';
    if (seccionContacto) seccionContacto.style.display = 'none';
    if (seccionResenas) seccionResenas.style.display = 'none';

    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => link.classList.remove('activo'));

    if (idSeccion === 'inicio') {
        hero.style.display = 'flex';
        if (tarjetas) tarjetas.style.display = 'grid';
        document.querySelector('.nav-links a:nth-child(1)').classList.add('activo');
    } else if (idSeccion === 'reserva') {
        seccionReserva.style.display = 'block';
        document.querySelector('.nav-links a:nth-child(2)').classList.add('activo');
    } else if (idSeccion === 'menu') {
        seccionMenu.style.display = 'block';
        document.querySelector('.nav-links a:nth-child(3)').classList.add('activo');
    } else if (idSeccion === 'domicilio') {
        seccionPedido.style.display = 'block';
        document.querySelector('.nav-links a:nth-child(4)').classList.add('activo');
    } else if (idSeccion === 'contacto') {
        seccionContacto.style.display = 'block';
        if (seccionResenas) seccionResenas.style.display = 'block';
        document.querySelector('.nav-links a:nth-child(5)').classList.add('activo');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks').classList.remove('active');
}

// Toggle menu hamburguesa (movil)
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}


// ===============================================
// FILTROS DE CATEGORIAS (MENU Y DOMICILIO)
// ===============================================

function filtrarSoloLectura(categoria, btn) {
    const botones = document.querySelectorAll('.cat-lectura');
    botones.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    const items = document.querySelectorAll('.platillo-lectura');
    items.forEach(item => {
        if (item.getAttribute('data-cat') === categoria) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function filtrarCompra(categoria, btn) {
    const botones = document.querySelectorAll('.cat-compra');
    botones.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    const items = document.querySelectorAll('.platillo');
    items.forEach(item => {
        if (item.getAttribute('data-cat') === categoria) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}


// ===============================================
// LOGICA DE RESERVAS Y EVENTOS (CALCULO + 5%)
// ===============================================

function toggleCamposEvento() {
    const tipo = document.getElementById('tipoReserva').value;
    const camposMesa = document.getElementById('camposMesaExtra');
    const camposEvento = document.getElementById('camposEventoExtra');

    if (tipo === 'Evento Privado') {
        camposMesa.style.display = 'none';
        camposEvento.style.display = 'flex';
        document.getElementById('horaReservaMesa').removeAttribute('required');
        document.getElementById('horaInicioEvento').setAttribute('required', 'true');
        document.getElementById('horaFinEvento').setAttribute('required', 'true');
    } else {
        camposMesa.style.display = 'flex';
        camposEvento.style.display = 'none';
        document.getElementById('horaReservaMesa').setAttribute('required', 'true');
        document.getElementById('horaInicioEvento').removeAttribute('required');
        document.getElementById('horaFinEvento').removeAttribute('required');
    }
}

function calcularDuracion() {
    const horaInicio = document.getElementById('horaInicioEvento').value;
    const horaFin = document.getElementById('horaFinEvento').value;

    if (horaInicio && horaFin) {
        const [hInicio, mInicio] = horaInicio.split(':').map(Number);
        const [hFin, mFin] = horaFin.split(':').map(Number);

        const inicioMinutos = (hInicio * 60) + mInicio;
        const finMinutos = (hFin * 60) + mFin;
        
        let diferenciaMinutos = finMinutos - inicioMinutos;
        if (diferenciaMinutos < 0) {
            diferenciaMinutos += 24 * 60;
        }

        const horas = (diferenciaMinutos / 60).toFixed(1);
        document.getElementById('duracionCalculada').innerText = horas;
    }
}

// Envio de formulario de reservas - mostrar factura
document.getElementById('formReservaGeneral').addEventListener('submit', function(e) {
    e.preventDefault();
    abrirFacturaReserva();
});

let datosReservaGlobal = {};

function abrirFacturaReserva() {
    const nombre = document.getElementById('nombreReserva').value;
    const tel = document.getElementById('telReserva').value;
    const personas = document.getElementById('personasReserva').value;
    const fecha = document.getElementById('fechaReserva').value;
    const canton = document.getElementById('cantonReserva').value;
    const tipo = document.getElementById('tipoReserva').value;
    const horaMesa = document.getElementById('horaReservaMesa').value;
    const errorReserva = document.getElementById('errorReserva');

    let camposVacios = [];
    if (!nombre) camposVacios.push('nombre');
    if (!tel) camposVacios.push('telefono');
    if (!personas) camposVacios.push('personas');
    if (!fecha) camposVacios.push('fecha');
    if (!canton) camposVacios.push('ubicacion');
    if (tipo === 'Mesa Normal' && !horaMesa) camposVacios.push('hora de llegada');

    if (tipo === 'Evento Privado') {
        const inicio = document.getElementById('horaInicioEvento').value;
        const fin = document.getElementById('horaFinEvento').value;
        if (!inicio) camposVacios.push('hora de inicio');
        if (!fin) camposVacios.push('hora de finalizacion');
    }

    if (camposVacios.length > 0) {
        errorReserva.innerHTML = 'Falta completar: <strong>' + camposVacios.join(', ') + '</strong>';
        errorReserva.classList.add('visible');
        return;
    } else {
        errorReserva.classList.remove('visible');
    }

    const numReserva = Math.floor(1000 + Math.random() * 9000);
    const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const fechaActual = new Date().toLocaleDateString('es-ES');

    let tituloTipo = tipo === 'Mesa Normal' ? 'RESERVA DE MESA' : 'COTIZACION DE EVENTO';
    document.getElementById('tituloTicketReserva').innerText = tituloTipo;

    let detalleHtml = '';
    let mensajeWs = '';

    detalleHtml += '<div class="ticket-item"><span>Nombre:</span><span>' + nombre + '</span></div>';
    detalleHtml += '<div class="ticket-item"><span>Telefono:</span><span>' + tel + '</span></div>';
    detalleHtml += '<div class="ticket-item"><span>Personas:</span><span>' + personas + '</span></div>';
    detalleHtml += '<div class="ticket-item"><span>Fecha:</span><span>' + fecha + '</span></div>';
    detalleHtml += '<div class="ticket-item"><span>Ubicacion:</span><span>' + canton + '</span></div>';
    detalleHtml += '<div class="ticket-item"><span>Tipo:</span><span>' + tipo + '</span></div>';

    if (tipo === 'Mesa Normal') {
        const horaMesa = document.getElementById('horaReservaMesa').value;
        detalleHtml += '<div class="ticket-item"><span>Hora llegada:</span><span>' + horaMesa + '</span></div>';
    } else {
        const motivo = document.getElementById('motivoEvento').value || 'No especificado';
        const inicio = document.getElementById('horaInicioEvento').value;
        const fin = document.getElementById('horaFinEvento').value;
        const duracion = document.getElementById('duracionCalculada').innerText;

        detalleHtml += '<div class="ticket-item"><span>Motivo:</span><span>' + motivo + '</span></div>';
        detalleHtml += '<div class="ticket-item"><span>Inicio:</span><span>' + inicio + '</span></div>';
        detalleHtml += '<div class="ticket-item"><span>Fin:</span><span>' + fin + '</span></div>';
        detalleHtml += '<div class="ticket-item"><span>Duracion:</span><span>' + duracion + 'h</span></div>';
    }

    document.getElementById('ticketDetalleReserva').innerHTML = detalleHtml;
    document.getElementById('ticketDatosReserva').innerHTML = '<strong>Factura #' + numReserva + '</strong><br>Generada: ' + fechaActual + ' ' + horaActual;

    datosReservaGlobal = { nombre, tel, personas, fecha, canton, tipo };

    if (tipo === 'Mesa Normal') {
        datosReservaGlobal.hora = document.getElementById('horaReservaMesa').value;
    } else {
        datosReservaGlobal.motivo = document.getElementById('motivoEvento').value || 'No especificado';
        datosReservaGlobal.inicio = document.getElementById('horaInicioEvento').value;
        datosReservaGlobal.fin = document.getElementById('horaFinEvento').value;
        datosReservaGlobal.duracion = document.getElementById('duracionCalculada').innerText;
    }

    document.getElementById('modalFacturaReserva').style.display = 'flex';
}

function cerrarFacturaReserva() {
    document.getElementById('modalFacturaReserva').style.display = 'none';
}

function enviarReservaWhatsApp(numeroWhatsApp) {
    let lineas = [];
    lineas.push('Nombre: ' + datosReservaGlobal.nombre);
    lineas.push('Telefono: ' + datosReservaGlobal.tel);
    lineas.push('Personas: ' + datosReservaGlobal.personas);
    lineas.push('Fecha: ' + datosReservaGlobal.fecha);
    lineas.push('Ubicacion: ' + datosReservaGlobal.canton);
    lineas.push('Tipo: ' + datosReservaGlobal.tipo);

    let titulo = datosReservaGlobal.tipo === 'Mesa Normal' ? 'RESERVA DE MESA' : 'COTIZACION DE EVENTO';

    if (datosReservaGlobal.tipo === 'Mesa Normal') {
        lineas.push('Hora llegada: ' + datosReservaGlobal.hora);
    } else {
        lineas.push('Motivo: ' + datosReservaGlobal.motivo);
        lineas.push('Inicio: ' + datosReservaGlobal.inicio);
        lineas.push('Fin: ' + datosReservaGlobal.fin);
        lineas.push('Duracion: ' + datosReservaGlobal.duracion + 'h');
        lineas.push('Nota: Llegada 1h antes para montaje. Recargo 5% por traslado.');
    }

    const canvas = generarCanvasFactura(lineas, titulo, '---');

    cerrarFacturaReserva();

    const linkDescarga = document.createElement('a');
    linkDescarga.href = canvas.toDataURL('image/png');
    linkDescarga.download = 'Factura-BANNE-Reserva.png';
    linkDescarga.click();

    setTimeout(function() {
        const texto = 'Solicitud de reserva BANNE - ' + datosReservaGlobal.nombre;
        const url = 'https://wa.me/' + numeroWhatsApp + '?text=' + encodeURIComponent(texto);
        window.open(url, '_blank');
    }, 500);
}


// ===============================================
// LOGICA DEL CARRITO DE COMPRAS (DOMICILIO)
// ===============================================

let carrito = {};

function cambiarCantidad(nombrePlatillo, precio, cambio) {
    if (!carrito[nombrePlatillo]) {
        carrito[nombrePlatillo] = { precio: precio, cantidad: 0 };
    }

    carrito[nombrePlatillo].cantidad += cambio;

    if (carrito[nombrePlatillo].cantidad < 0) {
        carrito[nombrePlatillo].cantidad = 0;
    }

    const contador = document.getElementById('cant-' + nombrePlatillo);
    if (contador) {
        contador.innerText = carrito[nombrePlatillo].cantidad;
    }

    actualizarSidebarCarrito();
}

function actualizarSidebarCarrito() {
    const listaSidebar = document.getElementById('listaFacturaSidebar');
    const totalSidebar = document.getElementById('totalFacturaSidebar');
    
    listaSidebar.innerHTML = '';
    let totalPagar = 0;
    let hayProductos = false;

    for (let item in carrito) {
        if (carrito[item].cantidad > 0) {
            hayProductos = true;
            let subtotal = carrito[item].cantidad * carrito[item].precio;
            totalPagar += subtotal;

            listaSidebar.innerHTML += '<div class="item-sidebar"><span>' + carrito[item].cantidad + 'x ' + item + '</span><span>Q' + subtotal + '</span></div>';
        }
    }

    if (!hayProductos) {
        listaSidebar.innerHTML = '<p class="texto-vacio">Aun no has seleccionado platillos.</p>';
    }

    totalSidebar.innerText = totalPagar;
}


// ===============================================
// FACTURACION VISUAL Y ENVIO A DOS NUMEROS
// ===============================================

function abrirFacturaVisual() {
    let totalPagar = 0;
    let hayItems = false;
    const ticketDetalle = document.getElementById('ticketDetalle');
    ticketDetalle.innerHTML = '';

    for (let item in carrito) {
        if (carrito[item].cantidad > 0) {
            hayItems = true;
            let subtotal = carrito[item].cantidad * carrito[item].precio;
            totalPagar += subtotal;
            
            ticketDetalle.innerHTML += '<div class="ticket-item"><span>' + carrito[item].cantidad + 'x ' + item + '</span><span>Q' + subtotal + '</span></div>';
        }
    }

    if (!hayItems) {
        document.getElementById('errorCarrito').classList.add('visible');
        return;
    } else {
        document.getElementById('errorCarrito').classList.remove('visible');
    }

    const nombre = document.getElementById('nombreEnvioSidebar').value;
    const dir = document.getElementById('cantonEnvioSidebar').value;
    const tel = document.getElementById('telEnvioSidebar').value;
    
    if (!nombre || !dir || !tel) {
        document.getElementById('errorDatosEnvio').classList.add('visible');
        if (!nombre) document.getElementById('nombreEnvioSidebar').classList.add('input-error');
        if (!dir) document.getElementById('cantonEnvioSidebar').classList.add('input-error');
        if (!tel) document.getElementById('telEnvioSidebar').classList.add('input-error');
        return;
    } else {
        document.getElementById('errorDatosEnvio').classList.remove('visible');
        document.getElementById('nombreEnvioSidebar').classList.remove('input-error');
        document.getElementById('cantonEnvioSidebar').classList.remove('input-error');
        document.getElementById('telEnvioSidebar').classList.remove('input-error');
    }

    document.getElementById('ticketTotal').innerText = totalPagar;
    document.getElementById('ticketDatosCliente').innerHTML = '<strong>Entrega a domicilio:</strong><br>Nombre: ' + nombre + '<br>Direccion: ' + dir + '<br>Telefono: ' + tel;

    document.getElementById('modalFactura').style.display = 'flex';
}

function cerrarFactura() {
    document.getElementById('modalFactura').style.display = 'none';
}

function generarCanvasFactura(lineas, tituloTotal, total) {
    const w = 400;
    const h = lineas.length * 28 + 180;
    const canvas = document.createElement('canvas');
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    ctx.fillStyle = '#2A1820';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#8D0A12';
    ctx.font = 'bold 22px Shojumaru, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BANNE', w / 2, 40);

    ctx.fillStyle = '#C4B5A8';
    ctx.font = '11px Montserrat, sans-serif';
    ctx.fillText('RESTAURANTE', w / 2, 58);

    ctx.strokeStyle = '#4A2030';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(w - 20, 70);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#F4D38A';
    ctx.font = 'bold 12px Montserrat, sans-serif';
    ctx.fillText(tituloTotal, w / 2, 90);

    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.lineTo(w - 20, 100);
    ctx.stroke();
    ctx.setLineDash([]);

    let y = 125;
    ctx.textAlign = 'left';
    ctx.font = '11px Montserrat, sans-serif';
    for (let i = 0; i < lineas.length; i++) {
        ctx.fillStyle = '#F5EDE4';
        ctx.fillText(lineas[i], 25, y);
        y += 28;
    }

    ctx.strokeStyle = '#4A2030';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
    ctx.setLineDash([]);

    y += 25;
    ctx.fillStyle = '#F4D38A';
    ctx.font = 'bold 14px Montserrat, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL: Q' + total, 25, y);
    ctx.textAlign = 'right';
    ctx.fillText('TOTAL: Q' + total, w - 25, y);

    ctx.strokeStyle = '#4A2030';
    ctx.setLineDash([4, 4]);
    y += 15;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
    ctx.setLineDash([]);

    y += 25;
    ctx.fillStyle = '#C4B5A8';
    ctx.font = '10px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Gracias por preferir BANNE', w / 2, y);

    return canvas;
}

function descargarFacturaPedido() {
    let lineas = [];
    let totalPagar = 0;
    for (let item in carrito) {
        if (carrito[item].cantidad > 0) {
            let subtotal = carrito[item].cantidad * carrito[item].precio;
            totalPagar += subtotal;
            lineas.push(carrito[item].cantidad + 'x ' + item + '  Q' + subtotal);
        }
    }
    lineas.push('');
    lineas.push('Subtotal: Q' + totalPagar);
    lineas.push('Envio: Q15');
    lineas.push('');

    const nombre = document.getElementById('nombreEnvioSidebar').value;
    const dir = document.getElementById('cantonEnvioSidebar').value;
    const tel = document.getElementById('telEnvioSidebar').value;
    lineas.push('');
    lineas.push('Entrega a domicilio:');
    lineas.push('Nombre: ' + nombre);
    lineas.push('Direccion: ' + dir);
    lineas.push('Telefono: ' + tel);

    const canvas = generarCanvasFactura(lineas, 'DESCRIPCION DE PEDIDO', totalPagar + 15);
    const link = document.createElement('a');
    link.download = 'Factura-BANNE-Pedido.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function descargarFacturaReserva() {
    let lineas = [];
    lineas.push('Nombre: ' + datosReservaGlobal.nombre);
    lineas.push('Telefono: ' + datosReservaGlobal.tel);
    lineas.push('Personas: ' + datosReservaGlobal.personas);
    lineas.push('Fecha: ' + datosReservaGlobal.fecha);
    lineas.push('Ubicacion: ' + datosReservaGlobal.canton);
    lineas.push('Tipo: ' + datosReservaGlobal.tipo);

    let titulo = datosReservaGlobal.tipo === 'Mesa Normal' ? 'RESERVA DE MESA' : 'COTIZACION DE EVENTO';

    if (datosReservaGlobal.tipo === 'Mesa Normal') {
        lineas.push('Hora llegada: ' + datosReservaGlobal.hora);
    } else {
        lineas.push('Motivo: ' + datosReservaGlobal.motivo);
        lineas.push('Inicio: ' + datosReservaGlobal.inicio);
        lineas.push('Fin: ' + datosReservaGlobal.fin);
        lineas.push('Duracion: ' + datosReservaGlobal.duracion + 'h');
    }

    const canvas = generarCanvasFactura(lineas, titulo, '---');
    const link = document.createElement('a');
    link.download = 'Factura-BANNE-Reserva.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function enviarWhatsAppReal(numeroWhatsApp) {
    const numPedido = Math.floor(1000 + Math.random() * 9000);
    const horaPedido = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const fechaPedido = new Date().toLocaleDateString('es-ES');

    const nombre = document.getElementById('nombreEnvioSidebar').value;
    const dir = document.getElementById('cantonEnvioSidebar').value;
    const tel = document.getElementById('telEnvioSidebar').value;

    let lineas = [];
    lineas.push('FACTURA BANNE #' + numPedido);
    lineas.push('Fecha: ' + fechaPedido + '  Hora: ' + horaPedido);
    lineas.push('------------------------------');
    lineas.push('DESCRIPCION DEL PEDIDO:');

    let totalPagar = 0;
    for (let item in carrito) {
        if (carrito[item].cantidad > 0) {
            let subtotal = carrito[item].cantidad * carrito[item].precio;
            totalPagar += subtotal;
            lineas.push('- ' + carrito[item].cantidad + 'x ' + item + ' - Q' + subtotal);
        }
    }

    const costoEnvio = 15;
    const totalConEnvio = totalPagar + costoEnvio;

    lineas.push('------------------------------');
    lineas.push('Subtotal: Q' + totalPagar);
    lineas.push('Envio: Q' + costoEnvio);
    lineas.push('------------------------------');
    lineas.push('DATOS DE ENTREGA:');
    lineas.push('Nombre: ' + nombre);
    lineas.push('Direccion: ' + dir);
    lineas.push('Telefono: ' + tel);

    const canvas = generarCanvasFactura(lineas, 'DESCRIPCION DE PEDIDO', totalConEnvio);

    cerrarFactura();

    const linkDescarga = document.createElement('a');
    linkDescarga.href = canvas.toDataURL('image/png');
    linkDescarga.download = 'Factura-BANNE-Pedido.png';
    linkDescarga.click();

    setTimeout(function() {
        const texto = 'Factura de pedido BANNE #' + numPedido + ' - Total: Q' + totalConEnvio;
        const url = 'https://wa.me/' + numeroWhatsApp + '?text=' + encodeURIComponent(texto);
        window.open(url, '_blank');
    }, 500);
}


// ===============================================
// LIMPIAR ERRORES AL ESCRIBIR
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    var inputsEnvio = ['nombreEnvioSidebar', 'cantonEnvioSidebar', 'telEnvioSidebar'];
    inputsEnvio.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function() {
                this.classList.remove('input-error');
                document.getElementById('errorDatosEnvio').classList.remove('visible');
                document.getElementById('errorCarrito').classList.remove('visible');
            });
        }
    });

    var inputsReserva = ['nombreReserva', 'telReserva', 'personasReserva', 'fechaReserva', 'cantonReserva'];
    inputsReserva.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function() {
                document.getElementById('errorReserva').classList.remove('visible');
            });
        }
    });
});