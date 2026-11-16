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
                        <div class="client-service">💅 ${item.service}</div>
                        ${item.notes ? `<div class="client-notes">📝 ${item.notes}</div>` : ''}
                    </div>
                </div>
                <div class="appt-right">
                    <span class="price-pill">${item.price} CLP</span>
                    <a href="https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(item.clientName.split(' ')[0])}!%20Te%20escribo%20de%20Butterfly%20Cosmetic%20para%20confirmar%20tu%20cita%20del%20${encodeURIComponent(item.dateStr)}%20a%20las%20${encodeURIComponent(item.time)}." target="_blank" class="btn-icon-wa" title="Escribir directo a WhatsApp">
                        💬 WhatsApp
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
                alert("⚠️ Este horario ya está reservado por una clienta.");
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
