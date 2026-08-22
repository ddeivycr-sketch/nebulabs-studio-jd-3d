(() => {
  "use strict";

  const config = window.CONFIGURACION_NEBULABS || {};
  const productos = Array.isArray(window.PRODUCTOS_NEBULABS)
    ? window.PRODUCTOS_NEBULABS
    : [];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const estado = {
    categoria: "Todos",
    busqueda: "",
    orden: "destacados",
    limite: 12
  };

  const elementos = {
    productGrid: $("#productGrid"),
    categoryFilters: $("#categoryFilters"),
    searchInput: $("#searchInput"),
    sortSelect: $("#sortSelect"),
    visibleCount: $("#visibleCount"),
    loadMoreButton: $("#loadMoreButton"),
    setupWarning: $("#setupWarning"),
    menuButton: $("#menuButton"),
    mainNav: $("#mainNav"),
    modal: $("#productModal"),
    modalImage: $("#modalImage"),
    modalTitle: $("#modalTitle"),
    modalDescription: $("#modalDescription"),
    modalBadges: $("#modalBadges"),
    modalInfo: $("#modalInfo"),
    modalNote: $("#modalNote"),
    modalWhatsapp: $("#modalWhatsapp")
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
    return producto.precioUnicolor ?? producto.precioMulticolor ?? null;
  }

  function formatearPrecio(valor) {
    if (valor === null || valor === undefined || valor === "") {
      return "Cotizar";
    }

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: config.moneda || "COP",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function formatearMedida(valor, estimada = false) {
    if (valor === null || valor === undefined || valor === "") {
      return "Por definir";
    }

    const numero = Number(valor);
    const medida = Number.isFinite(numero)
      ? new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 }).format(numero)
      : String(valor);

    return `${estimada ? "~" : ""}${medida} cm`;
  }

  function telefonoLimpio() {
    return String(config.whatsapp || "").replace(/\D/g, "");
  }

  function whatsappConfigurado() {
    const original = String(config.whatsapp || "");
    const limpio = telefonoLimpio();
    return !/[xX]/.test(original) && limpio.length >= 10 && limpio.length <= 15;
  }

  function instagramConfigurado() {
    const valor = String(config.instagram || "");
    return /^https?:\/\//i.test(valor) && !/USUARIO/i.test(valor);
  }

  function correoConfigurado() {
    const valor = String(config.correo || "");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) && !/EJEMPLO/i.test(valor);
  }

  function enlaceWhatsapp(producto = null) {
    const mensajeBase = config.mensajeWhatsapp || "Hola, quiero cotizar un producto.";
    const detalle = producto
      ? `\n\nProducto: ${producto.nombre}\nColor deseado: \nTamano deseado: \nCantidad: `
      : "\n\nProducto o idea: \nColor deseado: \nTamano deseado: \nCantidad: ";

    return `https://wa.me/${telefonoLimpio()}?text=${encodeURIComponent(mensajeBase + detalle)}`;
  }

  function activarEnlaceContacto(enlace, producto = null) {
    if (!whatsappConfigurado()) {
      enlace.href = "#contacto";
      enlace.classList.add("is-disabled");
      enlace.setAttribute("title", "Configura el numero de WhatsApp en assets/js/config.js");
      enlace.addEventListener("click", mostrarAvisoConfiguracion);
      return;
    }

    enlace.href = enlaceWhatsapp(producto);
    enlace.target = "_blank";
    enlace.rel = "noopener";
    enlace.classList.remove("is-disabled");
  }

  function mostrarAvisoConfiguracion(evento) {
    evento.preventDefault();
    window.alert(
      "Antes de usar este boton, reemplaza 57XXXXXXXXXX por tu numero real en assets/js/config.js."
    );
  }

  function configurarDatosGenerales() {
    const heroDescription = $("#heroDescription");
    const locationText = $("#locationText");
    const paymentText = $("#paymentText");
    const paymentShort = $("#paymentShort");
    const priceNotice = $("#priceNotice");
    const measureNotice = $("#measureNotice");
    const legalNotice = $("#legalNotice");
    const footerBrand = $("#footerBrand");
    const currentYear = $("#currentYear");
    const colorCloud = $("#colorCloud");
    const instagramLink = $("#instagramLink");
    const emailLink = $("#emailLink");

    document.title = `${config.marca || "NebuLabs Studio J.D 3D"} | Catalogo`;

    if (heroDescription) {
      heroDescription.textContent = config.descripcion || "Impresion 3D personalizada.";
    }
    if (locationText) locationText.textContent = config.ciudad || "Colombia";
    if (paymentText) {
      paymentText.textContent = (config.mediosPago || []).join(" o ") || "Por confirmar.";
    }
    if (paymentShort) {
      paymentShort.textContent = (config.mediosPago || []).join(" y ") || "Por confirmar";
    }
    if (priceNotice) priceNotice.textContent = config.avisoPrecios || "";
    if (measureNotice) measureNotice.textContent = config.avisoMedidas || "";
    if (legalNotice) legalNotice.textContent = config.avisoLegal || "";
    if (footerBrand) footerBrand.textContent = config.marca || "NebuLabs Studio J.D 3D";
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    if (colorCloud) {
      colorCloud.innerHTML = (config.coloresDisponibles || [])
        .map((color) => `<span class="color-chip">${escapeHtml(color)}</span>`)
        .join("");
    }

    $$(".js-whatsapp").forEach((enlace) => activarEnlaceContacto(enlace));

    if (instagramLink) {
      if (instagramConfigurado()) {
        instagramLink.href = config.instagram;
      } else {
        instagramLink.href = "#contacto";
        instagramLink.classList.add("is-disabled");
        instagramLink.title = "Configura Instagram en assets/js/config.js";
        instagramLink.addEventListener("click", (evento) => {
          evento.preventDefault();
          window.alert(
            "Reemplaza https://www.instagram.com/USUARIO/ por tu perfil real en assets/js/config.js."
          );
        });
      }
    }

    if (emailLink) {
      if (correoConfigurado()) {
        emailLink.href = `mailto:${config.correo}?subject=${encodeURIComponent(
          "Cotizacion de impresion 3D"
        )}`;
      } else {
        emailLink.href = "#contacto";
        emailLink.classList.add("is-disabled");
        emailLink.title = "Configura el correo en assets/js/config.js";
        emailLink.addEventListener("click", (evento) => {
          evento.preventDefault();
          window.alert(
            "Reemplaza CORREO@EJEMPLO.COM por tu correo real en assets/js/config.js."
          );
        });
      }
    }

    const configuracionIncompleta =
      !whatsappConfigurado() || !instagramConfigurado() || !correoConfigurado();

    if (elementos.setupWarning) {
      elementos.setupWarning.hidden = !configuracionIncompleta;
    }
  }

  function categoriasDisponibles() {
    const categorias = [...new Set(productos.map((producto) => producto.categoria))];
    return ["Todos", ...categorias.sort((a, b) => a.localeCompare(b, "es"))];
  }

  function renderFiltros() {
    if (!elementos.categoryFilters) return;

    elementos.categoryFilters.innerHTML = categoriasDisponibles()
      .map((categoria) => {
        const cantidad =
          categoria === "Todos"
            ? productos.length
            : productos.filter((producto) => producto.categoria === categoria).length;

        return `
          <button
            class="filter-button ${estado.categoria === categoria ? "is-active" : ""}"
            type="button"
            data-category="${escapeHtml(categoria)}"
            aria-pressed="${estado.categoria === categoria}"
          >
            ${escapeHtml(categoria)} <span aria-hidden="true">(${cantidad})</span>
          </button>
        `;
      })
      .join("");

    $$("[data-category]", elementos.categoryFilters).forEach((boton) => {
      boton.addEventListener("click", () => {
        estado.categoria = boton.dataset.category || "Todos";
        estado.limite = 12;
        renderFiltros();
        renderProductos();
      });
    });
  }

  function productosFiltrados() {
    const termino = normalizar(estado.busqueda);

    const filtrados = productos.filter((producto) => {
      const coincideCategoria =
        estado.categoria === "Todos" || producto.categoria === estado.categoria;
      const contenido = normalizar(
        `${producto.nombre} ${producto.categoria} ${producto.descripcion}`
      );
      const coincideBusqueda = !termino || contenido.includes(termino);
      return coincideCategoria && coincideBusqueda;
    });

    return filtrados.sort((a, b) => {
      if (estado.orden === "nombre") {
        return a.nombre.localeCompare(b.nombre, "es");
      }

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

      return (
        Number(b.destacado) - Number(a.destacado) ||
        Number(b.nuevo) - Number(a.nuevo) ||
        a.nombre.localeCompare(b.nombre, "es")
      );
    });
  }

  function badgesProducto(producto) {
    const badges = [`<span class="badge">${escapeHtml(producto.categoria)}</span>`];
    if (producto.nuevo) badges.push('<span class="badge badge--new">Nuevo</span>');
    return badges.join("");
  }

  function tarjetaProducto(producto) {
    const precioUnicolor = formatearPrecio(producto.precioUnicolor);
    const precioMulticolor = formatearPrecio(producto.precioMulticolor);
    const alto = formatearMedida(producto.altoCm, producto.medidaEstimada);
    const largo = formatearMedida(producto.largoCm, producto.medidaEstimada);
    const botonCotizar = whatsappConfigurado()
      ? `<a class="button button--primary" href="${enlaceWhatsapp(producto)}" target="_blank" rel="noopener">Cotizar</a>`
      : `<a class="button button--primary is-disabled" href="#contacto" data-unconfigured-whatsapp>Cotizar</a>`;

    return `
      <article class="product-card reveal" data-id="${escapeHtml(producto.id)}">
        <div class="product-media">
          <img
            src="${escapeHtml(producto.imagen)}"
            alt="${escapeHtml(producto.nombre)} impreso en 3D"
            loading="lazy"
            decoding="async"
          >
          <div class="product-badges">${badgesProducto(producto)}</div>
        </div>

        <div class="product-content">
          <span class="product-category">${escapeHtml(producto.categoria)}</span>
          <h3>${escapeHtml(producto.nombre)}</h3>
          <p class="product-description">${escapeHtml(producto.descripcion)}</p>

          <div class="price-grid">
            <div class="price-box">
              <span>Unicolor / unidad</span>
              <strong>${escapeHtml(precioUnicolor)}</strong>
            </div>
            <div class="price-box">
              <span>Multicolor / unidad</span>
              <strong>${escapeHtml(precioMulticolor)}</strong>
            </div>
          </div>

          <div class="measure-line">
            <div class="measure-box">
              <span>Alto</span>
              <strong>${escapeHtml(alto)}</strong>
            </div>
            <div class="measure-box">
              <span>Largo</span>
              <strong>${escapeHtml(largo)}</strong>
            </div>
          </div>

          <div class="product-actions">
            ${botonCotizar}
            <button class="icon-button" type="button" data-open-product="${escapeHtml(
              producto.id
            )}" aria-label="Ver detalle de ${escapeHtml(producto.nombre)}">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5c5.1 0 8.8 4.4 9.6 5.4a2.6 2.6 0 0 1 0 3.2C20.8 14.6 17.1 19 12 19S3.2 14.6 2.4 13.6a2.6 2.6 0 0 1 0-3.2C3.2 9.4 6.9 5 12 5Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
                <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProductos() {
    if (!elementos.productGrid) return;

    const filtrados = productosFiltrados();
    const visibles = filtrados.slice(0, estado.limite);

    if (elementos.visibleCount) {
      elementos.visibleCount.textContent = String(filtrados.length);
    }

    if (visibles.length === 0) {
      elementos.productGrid.innerHTML = `
        <div class="empty-state">
          <strong>No encontramos coincidencias.</strong>
          Prueba con otra palabra o selecciona una categoría diferente.
        </div>
      `;
    } else {
      elementos.productGrid.innerHTML = visibles.map(tarjetaProducto).join("");
    }

    if (elementos.loadMoreButton) {
      elementos.loadMoreButton.hidden = visibles.length >= filtrados.length;
    }

    $$("[data-open-product]", elementos.productGrid).forEach((boton) => {
      boton.addEventListener("click", () => abrirModal(boton.dataset.openProduct));
    });

    $$("[data-unconfigured-whatsapp]", elementos.productGrid).forEach((enlace) => {
      enlace.addEventListener("click", mostrarAvisoConfiguracion);
    });

    observarRevelados();
  }

  function abrirModal(idProducto) {
    const producto = productos.find((item) => item.id === idProducto);
    if (!producto || !elementos.modal) return;

    ultimoElementoEnfocado = document.activeElement;

    elementos.modalImage.src = producto.imagen;
    elementos.modalImage.alt = `${producto.nombre} impreso en 3D`;
    elementos.modalTitle.textContent = producto.nombre;
    elementos.modalDescription.textContent = producto.descripcion;
    elementos.modalBadges.innerHTML = badgesProducto(producto);
    elementos.modalNote.textContent = `${config.avisoPrecios || ""} ${config.avisoMedidas || ""}`;

    elementos.modalInfo.innerHTML = `
      <div class="modal-info-item">
        <span>Unicolor / unidad</span>
        <strong>${escapeHtml(formatearPrecio(producto.precioUnicolor))}</strong>
      </div>
      <div class="modal-info-item">
        <span>Multicolor / unidad</span>
        <strong>${escapeHtml(formatearPrecio(producto.precioMulticolor))}</strong>
      </div>
      <div class="modal-info-item">
        <span>Alto</span>
        <strong>${escapeHtml(formatearMedida(producto.altoCm, producto.medidaEstimada))}</strong>
      </div>
      <div class="modal-info-item">
        <span>Largo</span>
        <strong>${escapeHtml(formatearMedida(producto.largoCm, producto.medidaEstimada))}</strong>
      </div>
    `;

    elementos.modalWhatsapp.replaceWith(elementos.modalWhatsapp.cloneNode(true));
    elementos.modalWhatsapp = $("#modalWhatsapp");
    activarEnlaceContacto(elementos.modalWhatsapp, producto);

    elementos.modal.classList.add("is-open");
    elementos.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $(".modal-close", elementos.modal)?.focus();
  }

  function cerrarModal() {
    if (!elementos.modal?.classList.contains("is-open")) return;

    elementos.modal.classList.remove("is-open");
    elementos.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    elementos.modalImage.src = "";

    if (ultimoElementoEnfocado instanceof HTMLElement) {
      ultimoElementoEnfocado.focus();
    }
  }

  function configurarModal() {
    $$('[data-close-modal]').forEach((elemento) => {
      elemento.addEventListener("click", cerrarModal);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") cerrarModal();
    });
  }

  function configurarMenu() {
    if (!elementos.menuButton || !elementos.mainNav) return;

    elementos.menuButton.addEventListener("click", () => {
      const abierto = elementos.mainNav.classList.toggle("is-open");
      elementos.menuButton.setAttribute("aria-expanded", String(abierto));
    });

    $$("a", elementos.mainNav).forEach((enlace) => {
      enlace.addEventListener("click", () => {
        elementos.mainNav.classList.remove("is-open");
        elementos.menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function configurarCatalogo() {
    elementos.searchInput?.addEventListener("input", (evento) => {
      estado.busqueda = evento.target.value;
      estado.limite = 12;
      renderProductos();
    });

    elementos.sortSelect?.addEventListener("change", (evento) => {
      estado.orden = evento.target.value;
      estado.limite = 12;
      renderProductos();
    });

    elementos.loadMoreButton?.addEventListener("click", () => {
      estado.limite += 12;
      renderProductos();
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
      observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add("is-visible");
              observador.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -35px 0px" }
      );
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
    observarRevelados();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
