(() => {
  "use strict";

  const config = window.CONFIGURACION_NEBULABS || {};
  const productos = Array.isArray(window.PRODUCTOS_NEBULABS) ? window.PRODUCTOS_NEBULABS : [];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const estado = {
    categoria: "Todos",
    busqueda: "",
    orden: "destacados",
    limite: 15,
    seleccionado: null,
    modalProducto: null
  };

  const elementos = {
    productGrid: $("#productGrid"),
    categoryFilters: $("#categoryFilters"),
    searchInput: $("#searchInput"),
    sortSelect: $("#sortSelect"),
    visibleCount: $("#visibleCount"),
    loadMoreButton: $("#loadMoreButton"),
    menuButton: $("#menuButton"),
    mainNav: $("#mainNav"),
    modal: $("#productModal"),
    modalImage: $("#modalImage"),
    modalTitle: $("#modalTitle"),
    modalDescription: $("#modalDescription"),
    modalBadges: $("#modalBadges"),
    modalInfo: $("#modalInfo"),
    modalNote: $("#modalNote"),
    modalSelect: $("#modalSelect"),
    purchaseDock: $("#purchaseDock"),
    purchaseDockHint: $("#purchaseDockHint"),
    purchaseDockLabel: $("#purchaseDockLabel"),
    floatingTrackOne: $("#floatingTrackOne"),
    floatingTrackTwo: $("#floatingTrackTwo"),
    heroVisual: $("#heroVisual")
  };

  let ultimoElementoEnfocado = null;

  function normalizar(texto = "") {
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function escapeHtml(valor = "") {
    return String(valor)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function precioNumero(producto) {
    return producto?.precioUnicolor ?? producto?.precioMulticolor ?? null;
  }

  function formatearPrecio(valor) {
    if (valor === null || valor === undefined || valor === "") return "Cotizar";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: config.moneda || "COP",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function formatearMedida(valor) {
    if (valor === null || valor === undefined || valor === "") return "";
    const numero = Number(valor);
    const medida = Number.isFinite(numero)
      ? new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 }).format(numero)
      : String(valor);
    return `${medida} cm`;
  }

  function telefonoLimpio() {
    return String(config.whatsapp || "").replace(/\D/g, "");
  }

  function whatsappConfigurado() {
    const original = String(config.whatsapp || "");
    const limpio = telefonoLimpio();
    return !/[xX]/.test(original) && limpio.length >= 10 && limpio.length <= 15;
  }

  function enlaceWhatsapp(producto = null) {
    const mensajeBase = config.mensajeWhatsapp || "Hola, quiero cotizar un producto de NebuLabs.";
    const detalle = producto
      ? `\n\nID: ${producto.codigo || producto.id}\nProducto: ${producto.nombre}\nColor deseado: \nTamaño deseado: `
      : "\n\nProducto o idea: \nColor deseado: \nTamaño deseado: ";

    return `https://wa.me/${telefonoLimpio()}?text=${encodeURIComponent(mensajeBase + detalle)}`;
  }

  function mostrarAvisoWhatsapp(evento) {
    evento?.preventDefault();
    window.alert("El canal de WhatsApp aún no está disponible. Intenta nuevamente más tarde.");
  }

  function actualizarCompraGlobal() {
    const producto = estado.seleccionado;
    const enlaces = $$(".js-whatsapp");

    enlaces.forEach((enlace) => {
      if (!whatsappConfigurado()) {
        enlace.href = "#";
        enlace.onclick = mostrarAvisoWhatsapp;
        return;
      }
      enlace.onclick = null;
      enlace.href = enlaceWhatsapp(producto);
      enlace.target = "_blank";
      enlace.rel = "noopener";
    });

    if (elementos.purchaseDockHint) {
      elementos.purchaseDockHint.textContent = producto
        ? `${producto.codigo || producto.id} · ${producto.nombre}`
        : "Pedido general";
    }
    if (elementos.purchaseDockLabel) {
      elementos.purchaseDockLabel.textContent = producto ? "Comprar diseño seleccionado" : "Comprar / Cotizar";
    }
  }

  function configurarDatosGenerales() {
    const heroDescription = $("#heroDescription");
    const paymentText = $("#paymentText");
    const priceNotice = $("#priceNotice");
    const measureNotice = $("#measureNotice");
    const legalNotice = $("#legalNotice");
    const footerBrand = $("#footerBrand");
    const currentYear = $("#currentYear");
    const colorCloud = $("#colorCloud");

    document.title = `${config.marca || "NebuLabs Studio J.D 3D"} | Catálogo`;
    if (heroDescription) {
      heroDescription.textContent = "Explora figuras, juegos, accesorios y diseños personalizados creados para regalar, coleccionar y sorprender.";
    }
    if (paymentText) paymentText.textContent = (config.mediosPago || []).join(" o ") || "Por confirmar.";
    if (priceNotice) priceNotice.textContent = config.avisoPrecios || "El valor final puede variar según el diseño solicitado.";
    if (measureNotice) measureNotice.textContent = config.avisoMedidas || "Las medidas se confirman antes de fabricar.";
    if (legalNotice) legalNotice.textContent = config.avisoLegal || "";
    if (footerBrand) footerBrand.textContent = config.marca || "NebuLabs Studio J.D 3D";
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    if (colorCloud) {
      colorCloud.innerHTML = (config.coloresDisponibles || [])
        .map((color) => `<span class="color-chip">${escapeHtml(color)}</span>`)
        .join("");
    }

    actualizarCompraGlobal();
  }

  const categorias = [
    { nombre: "Todos", prueba: () => true },
    { nombre: "Novedades", prueba: (p) => Boolean(p.nuevo) || p.categoria === "Novedades" },
    { nombre: "Coleccionables", prueba: (p) => ["Coleccionables", "Articulados", "Fantasía", "Temporada"].includes(p.categoria) },
    { nombre: "Juegos", prueba: (p) => p.categoria === "Juegos" },
    { nombre: "Animales", prueba: (p) => p.categoria === "Animales" },
    { nombre: "Dinosaurios", prueba: (p) => ["Dinosaurios", "Esqueletos"].includes(p.categoria) },
    { nombre: "Llaveros", prueba: (p) => p.categoria === "Llaveros" },
    { nombre: "Hogar", prueba: (p) => ["Hogar y oficina", "Soportes", "Materas", "Accesorios", "Decoración"].includes(p.categoria) }
  ];

  function categoriaAgrupada(producto, categoria) {
    const grupo = categorias.find((item) => item.nombre === categoria);
    return grupo ? grupo.prueba(producto) : true;
  }

  function renderFiltros() {
    if (!elementos.categoryFilters) return;

    elementos.categoryFilters.innerHTML = categorias
      .map(({ nombre, prueba }) => {
        const cantidad = nombre === "Todos" ? productos.length : productos.filter(prueba).length;
        return `
          <button class="filter-button ${estado.categoria === nombre ? "is-active" : ""}" type="button"
            data-category="${escapeHtml(nombre)}" aria-pressed="${estado.categoria === nombre}">
            ${escapeHtml(nombre)} <span>(${cantidad})</span>
          </button>`;
      })
      .join("");

    $$("[data-category]", elementos.categoryFilters).forEach((boton) => {
      boton.addEventListener("click", () => {
        estado.categoria = boton.dataset.category || "Todos";
        estado.limite = 15;
        renderFiltros();
        renderProductos();
      });
    });
  }

  function productosFiltrados() {
    const termino = normalizar(estado.busqueda);

    const filtrados = productos.filter((producto) => {
      const coincideCategoria = categoriaAgrupada(producto, estado.categoria);
      const contenido = normalizar(`${producto.codigo || ""} ${producto.nombre} ${producto.categoria} ${producto.descripcion || ""} ${producto.promocion || ""}`);
      const coincideBusqueda = !termino || contenido.includes(termino);
      return coincideCategoria && coincideBusqueda;
    });

    return filtrados.sort((a, b) => {
      if (estado.orden === "nombre") return a.nombre.localeCompare(b.nombre, "es");
      if (estado.orden === "precio-asc") {
        const precioA = precioNumero(a) ?? Number.POSITIVE_INFINITY;
        const precioB = precioNumero(b) ?? Number.POSITIVE_INFINITY;
        return precioA - precioB || a.nombre.localeCompare(b.nombre, "es");
      }
      if (estado.orden === "precio-desc") {
        const precioA = precioNumero(a);
        const precioB = precioNumero(b);
        if (precioA === null && precioB === null) return a.nombre.localeCompare(b.nombre, "es");
        if (precioA === null) return 1;
        if (precioB === null) return -1;
        return precioB - precioA || a.nombre.localeCompare(b.nombre, "es");
      }
      return Number(b.destacado) - Number(a.destacado) || Number(b.nuevo) - Number(a.nuevo) || a.nombre.localeCompare(b.nombre, "es");
    });
  }

  function badgesProducto(producto) {
    const badges = [`<span class="badge">${escapeHtml(producto.categoria)}</span>`];
    if (producto.nuevo) badges.push('<span class="badge badge--new">Nuevo</span>');
    return badges.join("");
  }

  function medidasProducto(producto) {
    const items = [];
    if (producto.altoCm) items.push(["Alto", formatearMedida(producto.altoCm)]);
    if (producto.anchoCm) items.push(["Ancho", formatearMedida(producto.anchoCm)]);
    if (producto.largoCm) items.push(["Largo", formatearMedida(producto.largoCm)]);
    if (producto.fondoCm) items.push(["Fondo", formatearMedida(producto.fondoCm)]);
    return items;
  }

  function tarjetaProducto(producto) {
    const precio = formatearPrecio(precioNumero(producto));
    const seleccionado = estado.seleccionado?.id === producto.id;

    return `
      <article class="product-card reveal ${seleccionado ? "is-selected" : ""}" data-open-product="${escapeHtml(producto.id)}"
        tabindex="0" role="button" aria-label="Ver detalles de ${escapeHtml(producto.nombre)}">
        <div class="product-media">
          <img src="${escapeHtml(producto.imagen)}" alt="${escapeHtml(producto.nombre)} impreso en 3D" loading="lazy" decoding="async">
          <div class="product-badges">${badgesProducto(producto)}</div>
        </div>
        <div class="product-content">
          <div class="product-meta-row">
            <div class="product-code">${escapeHtml(producto.codigo || producto.id)}</div>
            <span class="product-category">${escapeHtml(producto.categoria)}</span>
          </div>
          <h3>${escapeHtml(producto.nombre)}</h3>
          <div class="product-price-row">
            <div class="product-price"><small>Precio / unidad</small><strong>${escapeHtml(precio)}</strong></div>
            ${producto.promocion ? `<span class="product-promo">${escapeHtml(producto.promocion)}</span>` : `<span class="product-view">Ver detalle <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>`}
          </div>
        </div>
      </article>`;
  }

  function renderProductos() {
    if (!elementos.productGrid) return;

    const filtrados = productosFiltrados();
    const visibles = filtrados.slice(0, estado.limite);

    if (elementos.visibleCount) elementos.visibleCount.textContent = String(filtrados.length);

    if (visibles.length === 0) {
      elementos.productGrid.innerHTML = `<div class="empty-state"><strong>No encontramos coincidencias.</strong>Prueba con otra palabra o selecciona una categoría diferente.</div>`;
    } else {
      elementos.productGrid.innerHTML = visibles.map(tarjetaProducto).join("");
    }

    if (elementos.loadMoreButton) elementos.loadMoreButton.hidden = visibles.length >= filtrados.length;

    $$("[data-open-product]", elementos.productGrid).forEach((tarjeta) => {
      const abrir = () => abrirModal(tarjeta.dataset.openProduct);
      tarjeta.addEventListener("click", abrir);
      tarjeta.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          abrir();
        }
      });
    });

    observarRevelados();
  }

  function abrirModal(idProducto) {
    const producto = productos.find((item) => item.id === idProducto);
    if (!producto || !elementos.modal) return;

    estado.modalProducto = producto;
    ultimoElementoEnfocado = document.activeElement;

    elementos.modalImage.src = producto.imagen;
    elementos.modalImage.alt = `${producto.nombre} impreso en 3D`;
    elementos.modalTitle.textContent = producto.nombre;
    elementos.modalDescription.textContent = producto.descripcion || "Diseño disponible bajo pedido.";
    elementos.modalBadges.innerHTML = badgesProducto(producto);

    const promo = producto.promocion
      ? `<div class="modal-info-item"><span>Promoción</span><strong>${escapeHtml(producto.promocion)}</strong></div>`
      : "";

    elementos.modalInfo.innerHTML = `
      <div class="modal-info-item"><span>ID</span><strong>${escapeHtml(producto.codigo || producto.id)}</strong></div>
      <div class="modal-info-item"><span>Precio / unidad</span><strong>${escapeHtml(formatearPrecio(precioNumero(producto)))}</strong></div>
      ${promo}
      ${medidasProducto(producto).map(([etiqueta, valor]) => `<div class="modal-info-item"><span>${etiqueta}</span><strong>${escapeHtml(valor)}</strong></div>`).join("")}
    `;

    elementos.modalNote.textContent = producto.promocion
      ? `Promoción disponible: ${producto.promocion}. Confirma disponibilidad al realizar tu pedido.`
      : "Selecciona este diseño y usa el botón Comprar / Cotizar ubicado en la parte inferior de la página.";

    elementos.modalSelect.textContent = estado.seleccionado?.id === producto.id ? "Diseño seleccionado" : "Elegir este diseño";

    elementos.modal.classList.add("is-open");
    elementos.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $(".modal-close", elementos.modal)?.focus();
  }

  function seleccionarProductoActual() {
    if (!estado.modalProducto) return;
    estado.seleccionado = estado.modalProducto;
    actualizarCompraGlobal();
    cerrarModal();
    renderProductos();

    if (elementos.purchaseDock) {
      elementos.purchaseDock.animate(
        [{ transform: "translateX(-50%) scale(1)" }, { transform: "translateX(-50%) scale(1.06)" }, { transform: "translateX(-50%) scale(1)" }],
        { duration: 380, easing: "ease-out" }
      );
    }
  }

  function cerrarModal() {
    if (!elementos.modal?.classList.contains("is-open")) return;
    elementos.modal.classList.remove("is-open");
    elementos.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    elementos.modalImage.src = "";
    estado.modalProducto = null;
    if (ultimoElementoEnfocado instanceof HTMLElement) ultimoElementoEnfocado.focus();
  }

  function configurarModal() {
    $$('[data-close-modal]').forEach((elemento) => elemento.addEventListener("click", cerrarModal));
    elementos.modalSelect?.addEventListener("click", seleccionarProductoActual);
    document.addEventListener("keydown", (evento) => { if (evento.key === "Escape") cerrarModal(); });
  }

  function configurarMenu() {
    if (!elementos.menuButton || !elementos.mainNav) return;
    elementos.menuButton.addEventListener("click", () => {
      const abierto = elementos.mainNav.classList.toggle("is-open");
      elementos.menuButton.setAttribute("aria-expanded", String(abierto));
    });
    $$("a", elementos.mainNav).forEach((enlace) => enlace.addEventListener("click", () => {
      elementos.mainNav.classList.remove("is-open");
      elementos.menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  function configurarCatalogo() {
    elementos.searchInput?.addEventListener("input", (evento) => {
      estado.busqueda = evento.target.value;
      estado.limite = 15;
      renderProductos();
    });
    elementos.sortSelect?.addEventListener("change", (evento) => {
      estado.orden = evento.target.value;
      estado.limite = 15;
      renderProductos();
    });
    elementos.loadMoreButton?.addEventListener("click", () => {
      estado.limite += 15;
      renderProductos();
    });

    $$('[data-filter-jump]').forEach((enlace) => {
      enlace.addEventListener("click", () => {
        const destino = enlace.dataset.filterJump;
        if (categorias.some((c) => c.nombre === destino)) {
          estado.categoria = destino;
          estado.limite = 15;
          renderFiltros();
          renderProductos();
        }
      });
    });
  }

  function renderGaleriaFlotante() {
    if (!elementos.floatingTrackOne || !elementos.floatingTrackTwo) return;

    const candidatos = productos
      .filter((p) => p.destacado || p.nuevo)
      .sort((a, b) => Number(b.nuevo) - Number(a.nuevo) || Number(b.destacado) - Number(a.destacado));
    const base = (candidatos.length >= 16 ? candidatos : productos).slice(0, 20);
    const mitad = Math.ceil(base.length / 2);
    const filaUno = base.slice(0, mitad);
    const filaDos = base.slice(mitad);

    const tile = (p) => `
      <figure class="floating-tile" data-open-floating="${escapeHtml(p.id)}">
        <img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}" loading="lazy" decoding="async">
        <figcaption><strong>${escapeHtml(p.nombre)}</strong><span>${escapeHtml(formatearPrecio(precioNumero(p)))}</span></figcaption>
      </figure>`;

    elementos.floatingTrackOne.innerHTML = [...filaUno, ...filaUno].map(tile).join("");
    elementos.floatingTrackTwo.innerHTML = [...filaDos, ...filaDos].map(tile).join("");

    $$('[data-open-floating]').forEach((item) => {
      item.addEventListener("click", () => abrirModal(item.dataset.openFloating));
    });
  }

  function configurarHeroMovimiento() {
    if (!elementos.heroVisual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elementos.heroVisual.addEventListener("pointermove", (evento) => {
      const rect = elementos.heroVisual.getBoundingClientRect();
      const x = ((evento.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((evento.clientY - rect.top) / rect.height - 0.5) * 12;
      elementos.heroVisual.style.setProperty("--mx", `${x}px`);
      elementos.heroVisual.style.setProperty("--my", `${y}px`);
    });
    elementos.heroVisual.addEventListener("pointerleave", () => {
      elementos.heroVisual.style.setProperty("--mx", "0px");
      elementos.heroVisual.style.setProperty("--my", "0px");
    });
  }

  let observador = null;
  function observarRevelados() {
    const elementosRevelables = $$(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      elementosRevelables.forEach((elemento) => elemento.classList.add("is-visible"));
      return;
    }
    if (!observador) {
      observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.07, rootMargin: "0px 0px -28px 0px" });
    }
    elementosRevelables.forEach((elemento) => observador.observe(elemento));
  }

  function iniciar() {
    configurarDatosGenerales();
    configurarMenu();
    configurarCatalogo();
    configurarModal();
    renderFiltros();
    renderProductos();
    renderGaleriaFlotante();
    configurarHeroMovimiento();
    observarRevelados();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
