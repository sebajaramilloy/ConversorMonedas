// Se corrige el ID a 'btn-buscar' para que coincida con el HTML
const btnBuscar = document.getElementById('btn-buscar');
const inputMonto = document.getElementById('monto');
const selectMoneda = document.getElementById('moneda');
const spanResultado = document.getElementById('resultado');
const errorBox = document.getElementById('error-box');

let miGrafico = null;

async function realizarConversion() {
    const monto = parseFloat(inputMonto.value);
    const moneda = selectMoneda.value;
 
    errorBox.textContent = '';
    spanResultado.textContent = 'Procesando...';

    if (isNaN(monto) || monto <= 0) {
        errorBox.textContent = 'Por favor, ingresa un monto válido en CLP';
        spanResultado.textContent = '$0';
        return;
    }

    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);

        if (!response.ok) {
            throw new Error('Error al conectar con la API');
        }

        const data = await response.json();

        const valorDia = data.serie[0].valor;
        const total = (monto / valorDia).toFixed(2);
        spanResultado.textContent = `Resultado: $${total}`;

        const historialReciente = data.serie.slice(0, 10).reverse();
        // Se formatea la fecha para que se vea limpia en el gráfico
        const etiquetas = historialReciente.map(item => new Date(item.fecha).toLocaleDateString('es-CL'));
        const valores = historialReciente.map(item => item.valor);

        dibujarGrafico(etiquetas, valores, moneda);

    } catch (error) {
        errorBox.textContent = 'Error al obtener los datos. Intenta nuevamente.';
        spanResultado.textContent = '$0';
    }
}

function dibujarGrafico(labels, values, monedaNombre) {
    const ctx = document.getElementById('grafico-historial').getContext('2d');

    if (miGrafico) {
        miGrafico.destroy();
    }

    miGrafico = new Chart(ctx, {
        type: 'line', // Se corrige "typer" por "type"
        data: {
            labels: labels,
            datasets: [{
                label: `Valor histórico de ${monedaNombre.toUpperCase()}`,
                data: values,
                borderColor: '#0dcaf0',
                backgroundColor: 'rgba(13, 202, 240, 0.1)',
                fill: true,
                tension: 0.3
            }]
        }
    });
}

btnBuscar.addEventListener('click', realizarConversion);