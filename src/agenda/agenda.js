document.addEventListener("DOMContentLoaded", () => {
    // 1. Parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientKey = urlParams.get("c") || "buttherfly_cosmetic";

    // 2. Elementos del DOM
    const loadingScreen = document.getElementById("loading-screen");
    const agendaLayout = document.getElementById("agenda-layout");
    
    // Header
    const brandAvatar = document.getElementById("brand-avatar");
    const brandName = document.getElementById("brand-name");
    const brandMeta = document.getElementById("brand-meta");
    const switchToChatBtn = document.getElementById("switch-to-chat-btn");
    const matrixToChatBtn = document.getElementById("matrix-to-chat-btn");

    // Stepper y Paneles
    const panels = {
        1: document.getElementById("panel-step-1"),
        2: document.getElementById("panel-step-2"),
        3: document.getElementById("panel-step-3"),
        4: document.getElementById("panel-step-4")
    };
    const stepNavs = {
        1: document.getElementById("step-nav-1"),
        2: document.getElementById("step-nav-2"),
        3: document.getElementById("step-nav-3"),
        4: document.getElementById("step-nav-4")
    };
    const stepLines = {
        1: document.getElementById("step-line-1"),
        2: document.getElementById("step-line-2"),
        3: document.getElementById("step-line-3")
    };

    // Componentes interactivos
    const servicesGrid = document.getElementById("services-grid");
    const btnToStep2 = document.getElementById("btn-to-step-2");
    
    const selectedServiceChip = document.getElementById("selected-service-chip");
    const dateStrip = document.getElementById("date-strip");
    const morningSlots = document.getElementById("morning-slots");
    const afternoonSlots = document.getElementById("afternoon-slots");
    const btnBackTo1 = document.getElementById("btn-back-to-1");
    const btnToStep3 = document.getElementById("btn-to-step-3");

    // Formulario
    const clientNameInput = document.getElementById("client-name");
    const clientPhoneInput = document.getElementById("client-phone");
    const clientEmailInput = document.getElementById("client-email");
    const clientNotesInput = document.getElementById("client-notes");
    const preConfirmSummary = document.getElementById("pre-confirm-summary");
    const btnBackTo2 = document.getElementById("btn-back-to-2");
    const btnSubmitBooking = document.getElementById("btn-submit-booking");

    // Voucher
    const voucherFolio = document.getElementById("voucher-folio");
    const voucherSpecialist = document.getElementById("voucher-specialist");
    const voucherRole = document.getElementById("voucher-role");
    const voucherClientName = document.getElementById("voucher-client-name");
    const voucherService = document.getElementById("voucher-service");
    const voucherDate = document.getElementById("voucher-date");
    const voucherTime = document.getElementById("voucher-time");
    const voucherPrice = document.getElementById("voucher-price");
    const voucherLocation = document.getElementById("voucher-location");
    const btnWhatsappConfirm = document.getElementById("btn-whatsapp-confirm");
    const btnRestartBooking = document.getElementById("btn-restart-booking");

    let config = null;

    // Estado del Agendamiento Web
    const bookingState = {
        service: null, // { id, name, price, duration, category }
        date: null,    // { dayName, dayNumber, monthName, fullDateStr }
        time: null,    // "15:30 PM"
        client: {
            name: "",
            phone: "",
            email: "",
            notes: ""
        }
    };

    // Iconos según avatar_type
    const avatarIcons = {
        butterfly: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 13V5"/>
            <path d="M12 5c-1.5-2.5-5-3.5-7.5-1.5S1.5 8 3.5 11c2.5 3.5 8.5 2 8.5 2"/>
            <path d="M12 5c1.5-2.5 5-3.5 7.5-1.5S22.5 8 20.5 11c-2.5 3.5-8.5 2-8.5 2"/>
            <path d="M12 13c-2 2-6 5.5-7.5 3s.5-5.5 2.5-6"/>
            <path d="M12 13c2 2 6 5.5 7.5 3s-.5-5.5-2.5-6"/>
            <path d="M12 13v7"/>
        </svg>`,
        beauty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9s-9-4.03-9-9a9 9 0 0 1 9-9z"/>
            <path d="M12 6v6l4 2"/>
        </svg>`,
        barber: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>`,
        dog: `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 21 12 21C17.52 21 21 17.52 21 12C21 6.48 17.52 2 12 2ZM12 18.5C8.97 18.5 6.5 16.03 6.5 13C6.5 9.97 8.97 7.5 12 7.5C15.03 7.5 17.5 9.97 17.5 13C17.5 16.03 15.03 18.5 12 18.5Z"/>
        </svg>`
    };

    // Formateador de moneda CLP
    function formatCLP(val) {
        return `$${Number(val).toLocaleString('es-CL')} CLP`;
    }

    // Cargar JSON del cliente
    fetch(`../clients/${clientKey}.json`)
        .then(res => {
            if (!res.ok) throw new Error("Cliente no encontrado");
            return res.json();
        })
        .then(data => {
            config = data;
            initPortal();
        })
        .catch(err => {
            console.error("Error al cargar cliente:", err);
            // Fallback a buttherfly_cosmetic
            window.location.search = "?c=buttherfly_cosmetic";
        });

    function initPortal() {
        // Colores temáticos
        if (config.theme_color) {
            document.documentElement.style.setProperty('--primary-color', config.theme_color);
        }
        if (config.theme_color_dark) {
            document.documentElement.style.setProperty('--primary-dark', config.theme_color_dark);
        }
        if (config.theme_color_light) {
            document.documentElement.style.setProperty('--primary-light', config.theme_color_light);
        }

        // Título de la pestaña
        document.title = `Reserva Online - ${config.name} | We Are Samod`;

        // Datos del header
        brandName.innerText = config.name;
        const bInfo = config.business_info || {};
        const specialist = bInfo.specialist || config.name;
        const role = bInfo.role || "Atención Profesional";
        const location = bInfo.location || "Villa Alemana, V Región 📍";
        
        brandMeta.innerText = `${specialist} • ${role} • ${location}`;
        brandAvatar.innerHTML = avatarIcons[config.avatar_type] || avatarIcons.butterfly || "✨";

        // Links hacia el simulador de chat
        const chatUrl = `../?c=${encodeURIComponent(clientKey)}`;
        if (switchToChatBtn) switchToChatBtn.href = chatUrl;
        if (matrixToChatBtn) matrixToChatBtn.href = chatUrl;

        // Renderizar lista de servicios
        renderServices();

        // Renderizar selector de fechas y horas
        renderDatesAndSlots();

        // Mostrar UI principal
        loadingScreen.style.display = "none";
        agendaLayout.style.display = "flex";
    }

    // Normalizar servicios (si no viene array 'services', autogenerar desde config)
    function getNormalizedServices() {
        if (Array.isArray(config.services) && config.services.length > 0) {
            return config.services;
        }

        const list = [];
        // Caso precios por categoría
        if (config.prices) {
            Object.entries(config.prices).forEach(([catName, priceObj], idx) => {
                if (typeof priceObj === "object") {
                    if (priceObj.completa) {
                        list.push({
                            id: `srv-${idx}-1`,
                            name: `Servicio Completo - ${catName}`,
                            category: catName,
                            price: priceObj.completa,
                            duration: "60 min",
                            description: "Atención completa con protocolo estándar profesional."
                        });
                    }
                    if (priceObj.baño) {
                        list.push({
                            id: `srv-${idx}-2`,
                            name: `Servicio Express - ${catName}`,
                            category: catName,
                            price: priceObj.baño,
                            duration: "45 min",
                            description: "Atención básica rápida de mantenimiento."
                        });
                    }
                }
            });
        }
        return list;
    }

    // Renderizar Paso 1 (Servicios)
    function renderServices() {
        servicesGrid.innerHTML = "";
        const services = getNormalizedServices();

        services.forEach(srv => {
            const card = document.createElement("div");
            card.className = "service-card";
            card.id = `srv-card-${srv.id}`;

            card.innerHTML = `
                <div>
                    <span class="service-category-tag">${srv.category || "Servicio"}</span>
                    <div class="service-card-header">
                        <h3 class="service-name">${srv.name}</h3>
                        <span class="service-price">${formatCLP(srv.price)}</span>
                    </div>
                    <p class="service-desc">${srv.description || "Servicio profesional garantizado."}</p>
                </div>
                <div class="service-card-footer">
                    <span class="service-duration">⏱️ ${srv.duration || "60 min"}</span>
                    <span class="select-radio-fake"></span>
                </div>
            `;

            card.addEventListener("click", () => {
                document.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
                bookingState.service = srv;
                btnToStep2.removeAttribute("disabled");
            });

            servicesGrid.appendChild(card);
        });
    }

    // Renderizar Fechas y Bloques Horarios
    function renderDatesAndSlots() {
        dateStrip.innerHTML = "";
        
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        
        const now = new Date();
        const availableDates = [];

        // Generar próximos 6 días laborables (omitir domingos)
        let added = 0;
        let dayOffset = 1; // Comenzar desde mañana
        while (added < 6) {
            const d = new Date();
            d.setDate(now.getDate() + dayOffset);
            dayOffset++;

            if (d.getDay() !== 0) { // Omitir domingo
                availableDates.push({
                    dayName: dayNames[d.getDay()],
                    dayNumber: d.getDate(),
                    monthName: monthNames[d.getMonth()],
                    fullDateStr: `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}`
                });
                added++;
            }
        }

        availableDates.forEach((dateObj, idx) => {
            const dateCard = document.createElement("div");
            dateCard.className = "date-card";
            if (idx === 0) {
                dateCard.classList.add("selected");
                bookingState.date = dateObj;
            }

            dateCard.innerHTML = `
                <span class="day-name">${dateObj.dayName}</span>
                <span class="day-number">${dateObj.dayNumber}</span>
                <span class="month-name">${dateObj.monthName}</span>
            `;

            dateCard.addEventListener("click", () => {
                document.querySelectorAll(".date-card").forEach(c => c.classList.remove("selected"));
                dateCard.classList.add("selected");
                bookingState.date = dateObj;
                checkCanAdvanceToStep3();
            });

            dateStrip.appendChild(dateCard);
        });

        // Bloques Mañana
        morningSlots.innerHTML = "";
        const mSlots = ["10:00 AM", "11:30 AM", "12:45 PM"];
        mSlots.forEach(time => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "slot-btn";
            btn.innerText = time;
            btn.addEventListener("click", () => selectSlot(btn, time));
            morningSlots.appendChild(btn);
        });

        // Bloques Tarde
        afternoonSlots.innerHTML = "";
        const aSlots = ["15:00 PM", "16:30 PM", "18:00 PM", "19:15 PM"];
        aSlots.forEach(time => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "slot-btn";
            btn.innerText = time;
            btn.addEventListener("click", () => selectSlot(btn, time));
            afternoonSlots.appendChild(btn);
        });
    }

    function selectSlot(buttonElem, timeStr) {
        document.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("selected"));
        buttonElem.classList.add("selected");
        bookingState.time = timeStr;
        checkCanAdvanceToStep3();
    }

    function checkCanAdvanceToStep3() {
        if (bookingState.date && bookingState.time) {
            btnToStep3.removeAttribute("disabled");
        } else {
            btnToStep3.setAttribute("disabled", "true");
        }
    }

    // Transición de Pasos
    function goToStep(stepNum) {
        // Ocultar todos los paneles
        Object.values(panels).forEach(p => p.style.display = "none");
        panels[stepNum].style.display = "block";

        // Actualizar Stepper
        for (let i = 1; i <= 4; i++) {
            stepNavs[i].classList.remove("active", "completed");
            if (i < stepNum) {
                stepNavs[i].classList.add("completed");
            } else if (i === stepNum) {
                stepNavs[i].classList.add("active");
            }

            if (i < 4) {
                if (i < stepNum) {
                    stepLines[i].style.background = "#059669";
                } else {
                    stepLines[i].style.background = "#e2e8f0";
                }
            }
        }

        // Scroll suave al contenedor
        document.querySelector(".booking-container").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Botones de Navegación
    btnToStep2.addEventListener("click", () => {
        if (!bookingState.service) return;
        
        // Renderizar chip resumen
        selectedServiceChip.innerHTML = `
            <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary-dark); display: block;">Servicio Elegido:</span>
                <span class="title">✨ ${bookingState.service.name} (${bookingState.service.duration})</span>
            </div>
            <span class="price">${formatCLP(bookingState.service.price)}</span>
        `;
        
        goToStep(2);
    });

    btnBackTo1.addEventListener("click", () => goToStep(1));

    btnToStep3.addEventListener("click", () => {
        if (!bookingState.date || !bookingState.time) return;

        // Resumen previo
        preConfirmSummary.innerHTML = `
            <strong>Resumen de tu cita:</strong><br>
            💅 <strong>Servicio:</strong> ${bookingState.service.name}<br>
            📅 <strong>Fecha:</strong> ${bookingState.date.fullDateStr}<br>
            ⏰ <strong>Hora:</strong> ${bookingState.time}<br>
            💵 <strong>Total Estimado:</strong> ${formatCLP(bookingState.service.price)}
        `;

        goToStep(3);
    });

    btnBackTo2.addEventListener("click", () => goToStep(2));

    // Confirmación Final (Paso 3 -> Paso 4)
    btnSubmitBooking.addEventListener("click", () => {
        const name = clientNameInput.value.trim();
        const phone = clientPhoneInput.value.trim();

        if (!name) {
            alert("Por favor ingresa tu nombre y apellido.");
            clientNameInput.focus();
            return;
        }

        if (!phone) {
            alert("Por favor ingresa tu número de WhatsApp para confirmar tu cita.");
            clientPhoneInput.focus();
            return;
        }

        bookingState.client = {
            name: name,
            phone: phone,
            email: clientEmailInput.value.trim(),
            notes: clientNotesInput.value.trim()
        };

        // Generar Folio aleatorio
        const folioNumber = Math.floor(1000 + Math.random() * 9000);
        const folioCode = `BC-${folioNumber}`;

        // Llenar datos del Voucher
        const bInfo = config.business_info || {};
        voucherFolio.innerText = `FOLIO: #${folioCode}`;
        voucherSpecialist.innerText = bInfo.specialist || config.name;
        voucherRole.innerText = bInfo.role || "Cosmetóloga Profesional";
        voucherClientName.innerText = bookingState.client.name;
        voucherService.innerText = `${bookingState.service.name} (${bookingState.service.duration})`;
        voucherDate.innerText = bookingState.date.fullDateStr;
        voucherTime.innerText = bookingState.time;
        voucherPrice.innerText = formatCLP(bookingState.service.price);
        voucherLocation.innerText = bInfo.location || "Villa Alemana, V Región 📍";

        // Preparar mensaje para WhatsApp
        const waText = encodeURIComponent(
            `¡Hola Camila! 🦋 Acabo de reservar una hora en tu Agenda Online:\n\n` +
            `📋 Folio: #${folioCode}\n` +
            `👤 Clienta: ${bookingState.client.name}\n` +
            `💅 Servicio: ${bookingState.service.name}\n` +
            `📅 Fecha: ${bookingState.date.fullDateStr}\n` +
            `⏰ Horario: ${bookingState.time}\n` +
            `💵 Valor: ${formatCLP(bookingState.service.price)}\n` +
            (bookingState.client.notes ? `📝 Nota: ${bookingState.client.notes}\n` : '') +
            `\n¡Quedo a la espera de tu confirmación! ✨`
        );
        btnWhatsappConfirm.href = `https://wa.me/?text=${waText}`;

        goToStep(4);
    });

    // Reiniciar
    btnRestartBooking.addEventListener("click", () => {
        bookingState.service = null;
        bookingState.date = null;
        bookingState.time = null;
        bookingState.client = { name: "", phone: "", email: "", notes: "" };
        
        clientNameInput.value = "";
        clientPhoneInput.value = "";
        clientEmailInput.value = "";
        clientNotesInput.value = "";

        document.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
        document.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("selected"));
        btnToStep2.setAttribute("disabled", "true");
        btnToStep3.setAttribute("disabled", "true");

        goToStep(1);
    });
});
