document.addEventListener("DOMContentLoaded", function() {
    const numFuncionarios = 300;
    const numDias = 31;
    const table = document.getElementById("attendanceTable").getElementsByTagName("tbody")[0];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Janeiro é 0, Dezembro é 11

    const statusCounts = {
        "presente": 0,
        "falta": 0,
        "atestado": 0,
        "desligado": 0,
        "remanejado": 0,
        "saida-medica": 0,
        "cobranca": 0,
        "suspensao": 0,
        "folga": 0,
        "compensacao": 0,
        "ferias": 0,
        "afastamento": 0
    };

    document.getElementById("addRowBtn").addEventListener("click", addRow);
    document.getElementById("filterInput").addEventListener("input", filterTable);
    document.getElementById("statusFilter").addEventListener("change", filterTable);
    document.getElementById("supervisorFilter").addEventListener("input", filterTable);

    createHeader();
    createRows();

    // Função para gerar a linha de cabeçalho com os dias do mês
    function createHeader() {
        const thead = document.getElementById("attendanceTable").getElementsByTagName("thead")[0];
        const headerRow = thead.rows[0];
        for (let i = 1; i <= numDias; i++) {
            const th = document.createElement("th");
            th.classList.add('sticky-row');
            const date = new Date(currentYear, currentMonth, i);
            const dateString = `${i}/${currentMonth + 1}/${currentYear}`;
            th.textContent = dateString;
            headerRow.appendChild(th);
        }
    }

    // Função para gerar as linhas dos funcionários
    function createRows() {
        for (let i = 1; i <= numFuncionarios; i++) {
            createRow(i);
        }
        updateSummary();
    }

    function createRow(index) {
        const row = table.insertRow();
        
        const cellName = row.insertCell();
        cellName.classList.add('sticky-col');
        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.value = "Funcionário " + index;
        cellName.appendChild(inputName);

        const cellLogin = row.insertCell();
        const inputLogin = document.createElement("input");
        inputLogin.type = "text";
        inputLogin.value = "login" + index;
        cellLogin.appendChild(inputLogin);

        const cellCPF = row.insertCell();
        const inputCPF = document.createElement("input");
        inputCPF.type = "text";
        inputCPF.value = "000.000.000-00";
        cellCPF.appendChild(inputCPF);

        const cellStatus = row.insertCell();
        const selectStatus = document.createElement("select");
        selectStatus.innerHTML = `
            <option value="">Selecione</option>
            <option value="ativo">Ativo</option>
            <option value="desligado">Desligado</option>
            <option value="afastado">Afastado</option>
            <option value="ferias">Férias</option>
            <option value="remanejado">Remanejado</option>
        `;
        cellStatus.appendChild(selectStatus);

        const cellSupervisor = row.insertCell();
        const inputSupervisor = document.createElement("input");
        inputSupervisor.type = "text";
        inputSupervisor.value = "Supervisor " + index;
        cellSupervisor.appendChild(inputSupervisor);

        for (let j = 1; j <= numDias; j++) {
            const cell = row.insertCell();
            
            const select = document.createElement("select");
            select.innerHTML = `
                <option value="">Selecione</option>
                <option value="presente">Presença</option>
                <option value="falta">Falta</option>
                <option value="atestado">Atestado</option>
                <option value="desligado">Desligado</option>
                <option value="remanejado">Remanejado</option>
                <option value="saida-medica">Saída Médica</option>
                <option value="cobranca">Cobrança</option>
                <option value="suspensao">Suspensão</option>
                <option value="folga">Folga</option>
                <option value="compensacao">Compensação</option>
                <option value="ferias">Férias</option>
                <option value="afastamento">Afastamento</option>
            `;
            select.addEventListener("change", () => {
                toggleAttendance(cell, select.value);
                updateSummary();
            });
            cell.appendChild(select);
        }
    }

    function toggleAttendance(cell, status) {
        const oldStatus = cell.className;
        if (oldStatus) {
            statusCounts[oldStatus]--;
        }
        if (status) {
            statusCounts[status]++;
        }
        cell.className = status;
    }

    function updateSummary() {
        const summaryTable = document.getElementById("summaryTable").getElementsByTagName("tbody")[0];
        summaryTable.innerHTML = "";
        
        for (let status in statusCounts) {
            const row = summaryTable.insertRow();
            
            const cellStatus = row.insertCell();
            cellStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            
            const cellCount = row.insertCell();
            cellCount.textContent = statusCounts[status];
            
            const cellPercentage = row.insertCell();
            const total = numFuncionarios * numDias;
            const percentage = ((statusCounts[status] / total) * 100).toFixed(2) + "%";
            cellPercentage.textContent = percentage;
        }
    }

    function addRow() {
        const index = table.rows.length + 1;
        createRow(index);
    }

    function filterTable() {
        const filter = document.getElementById("filterInput").value.toUpperCase();
        const statusFilter = document.getElementById("statusFilter").value;
        const supervisorFilter = document.getElementById("supervisorFilter").value.toUpperCase();
        const rows = table.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            if (cells.length > 0) {
                const nameCell = cells[0].getElementsByTagName("input")[0];
                const statusCell = cells[3].getElementsByTagName("select")[0];
                const supervisorCell = cells[4].getElementsByTagName("input")[0];
                const nameValue = nameCell.value.toUpperCase();
                const statusValue = statusCell.value;
                const supervisorValue = supervisorCell.value.toUpperCase();
                if (
                    (nameValue.indexOf(filter) > -1 || filter === "") &&
                    (statusValue === statusFilter || statusFilter === "") &&
                    (supervisorValue.indexOf(supervisorFilter) > -1 || supervisorFilter === "")
                ) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }
    }
});

