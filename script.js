// Firebase Authentication
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        loadExpenses(user.uid);
        document.getElementById('user-email').textContent = user.email;
    } else {
        window.location = 'index.html';  // Redireciona para a página de login se não estiver autenticado
    }
});

let expenseChart = null;  // Variável global para armazenar o gráfico de categorias
let paymentMethodChart = null;  // Variável global para armazenar o gráfico de formas de pagamento

// Carregar despesas do Firestore
function loadExpenses(uid) {
    document.getElementById('loading-indicator').style.display = 'block'; // Mostra o indicador de loading
    db.collection('expenses').where('uid', '==', uid).get().then(snapshot => {
        const expenseTableBody = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
        expenseTableBody.innerHTML = '';  // Limpa a tabela

        let totalAmount = 0;
        const categoryAmounts = {};
        const paymentMethodCounts = {};  // Alterado para contar o número de vezes que cada método é utilizado

        snapshot.forEach(doc => {
            const expense = doc.data();
            const row = expenseTableBody.insertRow();
            row.insertCell(0).textContent = expense.description;
            row.insertCell(1).textContent = expense.category;
            row.insertCell(2).textContent = expense.date;

            // Formatar e adicionar o símbolo de €
            const amountCell = row.insertCell(3);
            const amount = parseFloat(expense.amount).toFixed(2);
            amountCell.textContent = `${amount} €`;

            // Soma total das despesas
            totalAmount += parseFloat(amount);

            // Soma por categoria
            if (categoryAmounts[expense.category]) {
                categoryAmounts[expense.category] += parseFloat(amount);
            } else {
                categoryAmounts[expense.category] = parseFloat(amount);
            }

            // Contagem por forma de pagamento
            if (paymentMethodCounts[expense.paymentMethod]) {
                paymentMethodCounts[expense.paymentMethod] += 1;  // Incrementa a contagem
            } else {
                paymentMethodCounts[expense.paymentMethod] = 1;  // Inicializa a contagem
            }

            row.insertCell(4).textContent = expense.paymentMethod;
            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `<button onclick="editExpense('${doc.id}')">Editar</button>
                                     <button onclick="deleteExpense('${doc.id}')">Remover</button>`;
        });

        // Atualiza os gráficos e o total de despesas
        updateCategoryChart(categoryAmounts);
        updatePaymentMethodChart(paymentMethodCounts);
        document.getElementById('total-expenses').textContent = `${totalAmount.toFixed(2)} €`;

        document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading
    }).catch(error => {
        console.error("Erro ao carregar despesas:", error);
        document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading em caso de erro
    });
}

// Atualizar gráfico de formas de pagamento
function updatePaymentMethodChart(paymentMethodCounts) {
    document.getElementById('loading-indicator').style.display = 'block'; // Mostra o indicador de loading
    const ctx = document.getElementById('payment-method-chart').getContext('2d');

    if (paymentMethodChart) {
        paymentMethodChart.destroy();  // Destroi o gráfico anterior se existir
    }

    const paymentMethods = Object.keys(paymentMethodCounts);
    const counts = Object.values(paymentMethodCounts);

    paymentMethodChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: paymentMethods,
            datasets: [{
                data: counts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true
        }
    });
    document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading
}

// Atualizar gráfico de categorias
function updateCategoryChart(categoryAmounts) {
    document.getElementById('loading-indicator').style.display = 'block'; // Mostra o indicador de loading
    const ctx = document.getElementById('expense-chart').getContext('2d');

    if (expenseChart) {
        expenseChart.destroy();  // Destroi o gráfico anterior se existir
    }

    const categories = Object.keys(categoryAmounts);
    const amounts = Object.values(categoryAmounts);

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true
        }
    });
    document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading
}

// Criar ou atualizar uma despesa
document.getElementById('expense-form').addEventListener('submit', (e) => {
    document.getElementById('loading-indicator').style.display = 'block'; // Mostra o indicador de loading
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const expenseId = document.getElementById('expense-id').value;
    const expenseData = {
        uid: user.uid,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        amount: parseFloat(document.getElementById('amount').value).toFixed(2),  // Garantir 2 casas decimais
        paymentMethod: document.getElementById('payment-method').value
    };

    if (expenseId) {
        db.collection('expenses').doc(expenseId).update(expenseData).then(() => {
            closeExpenseForm();
            loadExpenses(user.uid);
        }).catch(error => {
            console.error("Erro ao atualizar despesa:", error);
        });
    } else {
        db.collection('expenses').add(expenseData).then(() => {
            closeExpenseForm();
            loadExpenses(user.uid);
        }).catch(error => {
            console.error("Erro ao criar despesa:", error);
        });
    }
    document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading
});

// Editar despesa
function editExpense(id) {
    document.getElementById('loading-indicator').style.display = 'block'; // Mostra o indicador de loading
    db.collection('expenses').doc(id).get().then(doc => {
        if (doc.exists) {
            const expense = doc.data();
            document.getElementById('expense-id').value = id;
            document.getElementById('description').value = expense.description;
            document.getElementById('category').value = expense.category;
            document.getElementById('date').value = expense.date;
            document.getElementById('amount').value = parseFloat(expense.amount).toFixed(2);  // Garantir 2 casas decimais
            document.getElementById('payment-method').value = expense.paymentMethod;
            showExpenseForm();
        }
    }).catch(error => {
        console.error("Erro ao editar despesa:", error);
    });
    document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading
}

// Remover despesa
function deleteExpense(id) {
    document.getElementById('loading-indicator').style.display = 'block'; // Mostra o indicador de loading
    const user = firebase.auth().currentUser;
    db.collection('expenses').doc(id).delete().then(() => {
        loadExpenses(user.uid);
    }).catch(error => {
        console.error("Erro ao remover despesa:", error);
    });
    document.getElementById('loading-indicator').style.display = 'none'; // Esconde o indicador de loading
}

// Mostrar e ocultar o formulário de despesas
function showExpenseForm() {
    document.getElementById('expense-form-container').style.display = 'block';
}

function closeExpenseForm() {
    document.getElementById('expense-form-container').style.display = 'none';
    document.getElementById('expense-form').reset();
    document.getElementById('expense-id').value = '';
}

// Mostrar e ocultar o modal de análise
function showAnalysisModal() {
    document.getElementById('analysis-modal').style.display = 'block';
}

function closeAnalysisModal() {
    document.getElementById('analysis-modal').style.display = 'none';
}

// Logout do usuário
function logout() {
    firebase.auth().signOut().then(() => {
        window.location = 'index.html';  // Redireciona para a página de login após logout
    });
}
