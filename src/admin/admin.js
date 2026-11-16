document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientKey = urlParams.get("c") || "buttherfly_cosmetic";

    // Cargar datos del cliente si existen
    fetch(`../clients/${clientKey}.json`)
        .then(r => r.json())
        .then(config => {
            if (config.name) document.getElementById("brand-title").innerText = config.name;
            if (config.business_info && config.business_info.specialist) {
                document.getElementById("specialist-name").innerText = `${config.business_info.specialist} • Panel de Control`;
            }
            if (config.theme_color) {
                document.documentElement.style.setProperty('--primary', config.theme_color);
            }
            if (config.theme_color_dark) {
                document.documentElement.style.setProperty('--primary-dark', config.theme_color_dark);
            }
            if (config.theme_color_light) {
                document.documentElement.style.setProperty('--primary-light', config.theme_color_light);
            }
        })
        .catch(e => console.log("Usando datos default de demo:", e));

    // Citas simuladas realistas para Camila
    const mockAppointments = [
        {
            id: 1,
            time: "10:00 AM",
            dayLabel: "HOY",
            dateStr: "Lun 16 Nov",
            clientName: "Valentina Morales",
            service: "Soft Gel ($25.000)",
            phone: "+56987654321",
            notes: "Viene con esmaltado anterior para retiro.",
            price: "$25.000",
            category: "today"
        },
        {
            id: 2,
            time: "15:30 PM",
            dayLabel: "HOY",
            dateStr: "Lun 16 Nov",
            clientName: "Constanza Lagos",
            service: "Kapping en Gel ($19.000)",
            phone: "+56912345678",
            notes: "Uñas naturales frágiles, quiere fortalecer.",
            price: "$19.000",
            category: "today"
        },
        {
            id: 3,
            time: "11:30 AM",
            dayLabel: "MAÑANA",
            dateStr: "Mar 17 Nov",
            clientName: "Javiera San Martín",
            service: "Esmaltado Permanente ($17.000)",
            phone: "+56955554444",
            notes: "Diseño francés clásico en blanco.",
            price: "$17.000",
            category: "tomorrow"
        },
        {
            id: 4,
            time: "16:00 PM",
            dayLabel: "MAÑANA",
            dateStr: "Mar 17 Nov",
            clientName: "Francisca Silva",
            service: "Lifting de Pestañas + Perfilado ($18.000)",
            phone: "+56999998888",
            notes: "Primera vez en lifting, ojos sensibles.",
            price: "$18.000",
            category: "tomorrow"
        },
        {
            id: 5,
            time: "11:00 AM",
            dayLabel: "JUEVES",
            dateStr: "Jue 19 Nov",
            clientName: "Camila Andrea Rojas",
            service: "Soft Gel ($25.000)",
            phone: "+56933332222",
            notes: "Largo almendrado número 3.",
            price: "$25.000",
            category: "future"
        },
        {
            id: 6,
            time: "16:30 PM",
            dayLabel: "VIERNES",
            dateStr: "Vie 20 Nov",
            clientName: "María Paz Sepúlveda",
            service: "Limpieza de Uñas ($12.000)",
            phone: "+56977771111",
            notes: "Mantención antes de viajar.",
            price: "$12.000",
            category: "future"
        }
    ];

    const appointmentsContainer = document.getElementById("appointments-list");

    function renderAppointments(filter = "all") {
        appointmentsContainer.innerHTML = "";
        const filtered = mockAppointments.filter(item => {
            if (filter === "all") return true;
            return item.category === filter;
        });

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = `appointment-item ${item.category === 'today' ? 'today' : ''}`;

            card.innerHTML = `
                <div class="appt-left">
                    <div class="time-box">
                        <span class="time">${item.time}</span>
                        <span class="date">${item.dayLabel}</span>
                    </div>
                    <div class="client-info">
                        <h4>${item.clientName}</h4>
                        <div class="client-service">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="vertical-align: -2px; margin-right: 4px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                            ${item.service}
                        </div>
                        ${item.notes ? `<div class="client-notes">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" style="vertical-align: -2px; margin-right: 3px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            ${item.notes}
                        </div>` : ''}
                    </div>
                </div>
                <div class="appt-right">
                    <span class="price-pill">${item.price} CLP</span>
                    <a href="https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(item.clientName.split(' ')[0])}!%20Te%20escribo%20de%20Butterfly%20Cosmetic%20para%20confirmar%20tu%20cita%20del%20${encodeURIComponent(item.dateStr)}%20a%20las%20${encodeURIComponent(item.time)}." target="_blank" class="btn-icon-wa" title="Escribir directo a WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="vertical-align: -1px; margin-right: 4px;"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92zm0 18.17c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.4 0-4.54 3.7-8.24 8.25-8.24 4.55 0 8.25 3.7 8.25 8.24 0 4.54-3.7 8.26-8.25 8.26zm4.52-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z"/></svg>
                        WhatsApp
                    </a>
                </div>
            `;
            appointmentsContainer.appendChild(card);
        });
    }

    renderAppointments("all");

    // Filtros
    document.querySelectorAll(".filter-pills .pill").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-pills .pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderAppointments(btn.getAttribute("data-filter"));
        });
    });

    // Toggle de chips de disponibilidad
    document.querySelectorAll(".time-chips-toggle .chip").forEach(chip => {
        chip.addEventListener("click", () => {
            if (chip.classList.contains("booked")) {
                alert("Este horario ya está reservado por una clienta.");
                return;
            }
            if (chip.classList.contains("active")) {
                chip.classList.remove("active");
                chip.classList.add("blocked");
                chip.innerText = chip.innerText.replace(" (Off)", "") + " (Off)";
            } else {
                chip.classList.remove("blocked");
                chip.classList.add("active");
                chip.innerText = chip.innerText.replace(" (Off)", "");
            }
        });
    });
});
