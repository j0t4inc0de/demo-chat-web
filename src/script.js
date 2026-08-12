document.addEventListener("DOMContentLoaded", () => {
    // Referencias al DOM
    const loadingScreen = document.getElementById("loading-screen");
    const appContainer = document.getElementById("app-container");
    const chatBody = document.getElementById("chat-body");
    const quickRepliesContainer = document.getElementById("quick-replies");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    // Elementos dinámicos del cliente
    const sidebarTitle = document.getElementById("sidebar-title");
    const sidebarSubtitle = document.getElementById("sidebar-subtitle");
    const problemTitle = document.getElementById("problem-title");
    const problemDesc = document.getElementById("problem-desc");
    const solutionTitle = document.getElementById("solution-title");
    const solutionDesc = document.getElementById("solution-desc");
    const profitTitle = document.getElementById("profit-title");
    const profitDesc = document.getElementById("profit-desc");
    const chatAvatar = document.getElementById("chat-avatar");
    const contactName = document.getElementById("contact-name");
    const contactStatus = document.getElementById("contact-status");

    // Obtener cliente por parámetro de URL (?c=nombre_cliente)
    const urlParams = new URLSearchParams(window.location.search);
    const clientKey = urlParams.get("c") || "huellitas_felices";

    let config = null;

    // Estado del agendamiento interactivo
    let bookingState = {
        size: "",
        price: 0,
        service: "",
        time: "",
        userInput: ""
    };

    // SVGs para el avatar de la cabecera
    const avatars = {
        dog: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 21 12 21C17.52 21 21 17.52 21 12C21 6.48 17.52 2 12 2ZM12 18.5C8.97 18.5 6.5 16.03 6.5 13C6.5 9.97 8.97 7.5 12 7.5C15.03 7.5 17.5 9.97 17.5 13C17.5 16.03 15.03 18.5 12 18.5Z" fill="var(--whatsapp-green)"/>
                <circle cx="9" cy="11.5" r="1.5" fill="#FFFFFF"/>
                <circle cx="15" cy="11.5" r="1.5" fill="#FFFFFF"/>
                <path d="M10.5 14.5C10.5 14.5 11.25 15.5 12 15.5C12.75 15.5 13.5 14.5 13.5 14.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
              </svg>`,
        barber: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--whatsapp-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                 </svg>`
    };

    // Helper para formatear textos con variables del estado {var}
    function formatText(template, vars) {
        return template.replace(/{(\w+)}/g, (match, key) => {
            return typeof vars[key] !== 'undefined' ? vars[key] : match;
        });
    }

    // Helper para la hora en formato HH:MM
    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Cargar datos del cliente
    fetch(`clients/${clientKey}.json`)
        .then(response => {
            if (!response.ok) throw new Error("Cliente no encontrado");
            return response.json();
        })
        .then(data => {
            config = data;
            initializeSimulator();
        })
        .catch(err => {
            console.error("Error al cargar configuración:", err);
            // Fallback amistoso: Carga de emergencia de huellitas felices
            alert("No se encontró el perfil de cliente especificado. Cargando demo por defecto.");
            window.location.search = "?c=huellitas_felices";
        });

    // Inicializar interfaz con la configuración cargada
    function initializeSimulator() {
        // 1. Inyectar variables de color de tema
        document.documentElement.style.setProperty('--whatsapp-green', config.theme_color);
        document.documentElement.style.setProperty('--whatsapp-green-dark', config.theme_color_dark);
        document.documentElement.style.setProperty('--whatsapp-light', config.theme_color_light);

        // 2. Establecer textos de la barra lateral (Pitch)
        document.title = `Simulador WhatsApp - ${config.name} | We Are Samod`;
        sidebarTitle.innerText = config.sidebar.title;
        sidebarSubtitle.innerHTML = config.sidebar.subtitle;
        problemTitle.innerText = config.sidebar.problem_title;
        problemDesc.innerText = config.sidebar.problem_desc;
        solutionTitle.innerText = config.sidebar.solution_title;
        solutionDesc.innerText = config.sidebar.solution_desc;
        profitTitle.innerText = config.sidebar.profit_title;
        profitDesc.innerText = config.sidebar.profit_desc;

        // 3. Cabecera del chat
        contactName.innerText = config.name;
        contactStatus.innerText = config.status;
        chatAvatar.innerHTML = avatars[config.avatar_type] || avatars.dog;

        // 4. Cargar primer mensaje de bienvenida
        appendMessage(config.flow.welcome);

        // 5. Ocultar pantalla de carga e iniciar
        loadingScreen.style.display = "none";
        appContainer.style.display = "flex";

        startFlow();
    }

    // Helper para parsear markdown básico (negritas y saltos de línea)
    function parseMarkdown(text) {
        if (!text) return "";
        let html = text.replace(/\n/g, "<br>");
        // Reemplazar **negrita** por <strong>negrita</strong>
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Reemplazar *cursiva* por <em>cursiva</em>
        html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
        return html;
    }

    // Agregar burbuja de mensaje
    function appendMessage(text, isSent = false) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        
        msgDiv.innerHTML = `
            <div class="message-content">${parseMarkdown(text)}</div>
            <div class="message-time">${getFormattedTime()}</div>
        `;
        
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Simular escritura de la IA (typing...)
    function simulateBotResponse(callback, delay = 1500) {
        const indicator = document.createElement("div");
        indicator.className = "typing-indicator";
        indicator.id = "bot-typing";
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
            const ind = document.getElementById("bot-typing");
            if (ind) ind.remove();
            callback();
        }, delay);
    }

    // Renderizar botones de respuesta rápida
    function renderQuickReplies(options) {
        quickRepliesContainer.innerHTML = "";
        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "quick-reply-btn";
            btn.innerText = opt.label;
            btn.addEventListener("click", () => {
                appendMessage(opt.label, true);
                quickRepliesContainer.innerHTML = "";
                opt.action();
            });
            quickRepliesContainer.appendChild(btn);
        });
    }

    // --- FLUJO CONVERSACIONAL ---

    // Paso 1: Selección de categoría (ej: tamaño de perro o tipo de cliente)
    function startFlow() {
        const replies = config.flow.step_1_options.map(opt => {
            return {
                label: opt.label,
                action: () => selectCategory(opt.value)
            };
        });
        renderQuickReplies(replies);
    }

    // Paso 2: Selección de Servicio
    function selectCategory(category) {
        bookingState.size = category;
        
        simulateBotResponse(() => {
            // Extraer precios
            const priceConf = config.prices[category];
            
            // Reemplazar textos dinámicos de precio en la plantilla del mensaje
            let msgText = config.flow.step_2_message;
            msgText = msgText.replace("{size}", category);
            msgText = msgText.replace("${price_completa}", priceConf.completa.toLocaleString('es-CL'));
            msgText = msgText.replace("${price_bano}", priceConf.baño.toLocaleString('es-CL'));

            appendMessage(msgText);
            
            // Renderizar las respuestas para el paso 2
            const replies = config.flow.step_2_options.map(opt => {
                const targetPrice = priceConf[opt.price_type];
                return {
                    label: opt.label,
                    action: () => selectService(opt.value, targetPrice)
                };
            });
            renderQuickReplies(replies);
        });
    }

    // Paso 3: Selección de Horarios
    function selectService(service, price) {
        bookingState.service = service;
        bookingState.price = price;

        simulateBotResponse(() => {
            appendMessage(config.flow.step_3_message);
            
            const replies = config.flow.step_3_options.map(opt => {
                return {
                    label: opt.label,
                    action: () => selectTime(opt.value)
                };
            });
            renderQuickReplies(replies);
        });
    }

    // Paso 4: Petición de nombre mediante entrada libre (Teclado)
    function selectTime(time) {
        bookingState.time = time;

        simulateBotResponse(() => {
            appendMessage(config.flow.step_4_message);
            
            // Habilitar escritura
            chatInput.removeAttribute("disabled");
            chatInput.placeholder = config.flow.step_4_placeholder;
            chatInput.focus();
            sendBtn.removeAttribute("disabled");
        });
    }

    // Paso 5: Confirmación final
    function submitName() {
        const inputVal = chatInput.value.trim();
        if (!inputVal) return;

        bookingState.userInput = inputVal;
        appendMessage(inputVal, true);
        
        // Limpiar y bloquear input
        chatInput.value = "";
        chatInput.setAttribute("disabled", "true");
        chatInput.placeholder = "Escribe un mensaje...";
        sendBtn.setAttribute("disabled", "true");

        // Responder confirmación formateada
        simulateBotResponse(() => {
            const formattedPrice = bookingState.price.toLocaleString('es-CL');
            
            // Variables de reemplazo para la confirmación
            const vars = {
                input: bookingState.userInput,
                size: bookingState.size,
                service: bookingState.service,
                time: bookingState.time,
                price: formattedPrice
            };
            
            const finalConfirm = formatText(config.flow.step_5_message, vars);
            appendMessage(finalConfirm);
        }, 2000);
    }

    // Eventos
    sendBtn.addEventListener("click", submitName);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            submitName();
        }
    });
});
