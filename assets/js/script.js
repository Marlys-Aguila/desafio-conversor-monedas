const valorPesosChilenos = document.querySelector("#valor-pesos-chilenos");
const monedaConvertir = document.querySelector("#moneda-a-convertir");
const botonBuscar = document.querySelector("#buscar");
const contenedorResultado = document.querySelector("#resultado");
let grapharea = document.getElementById("myChart").getContext("2d");
let myChart;

botonBuscar.addEventListener("click", async () => {
    let valorMoneda = await obtenerValorMoneda(monedaConvertir.value);
    let resultadoConversion = Number(
        (valorPesosChilenos.value / valorMoneda).toFixed(2)
    );
    contenedorResultado.innerHTML = `Resultado: $${resultadoConversion} pesos.`;

    if (myChart) {
        myChart.destroy();
    }

    graficar(monedaConvertir.value);
});

async function obtenerValorMoneda(tipo_moneda) {
    try {
        const respuesta = await fetch("https://mindicador.cl/api/");
        const data = await respuesta.json();
        return data[tipo_moneda].valor;
    } catch (error) {
        alert(error.message);
    }
}

async function obtenerSerieMoneda(tipo_moneda, num_elementos = 10) {
    try {
        const respuesta = await fetch(
            "https://mindicador.cl/api/" + tipo_moneda
        );
        const data = await respuesta.json();
        return data.serie.slice(0, num_elementos);
    } catch (error) {
        alert(error.message);
    }
}

async function graficar(tipo_moneda) {
    let serie = await obtenerSerieMoneda(tipo_moneda);
    serie = serie.reverse();
    let etiquetas = serie.map((fecha) => {
        return fecha.fecha.substr(0, 10);
    });
    let datos = serie.map((valor) => {
        return valor.valor;
    });

    const data = {
        labels: etiquetas,
        datasets: [
            {
                label: "Variación últimos 10 días",
                backgroundColor: "white",
                borderColor: "#31d2f2",
                data: datos,
            },
        ],
    };

    const config = {
        type: "line",
        data: data,
        options: {},
    };

    myChart = new Chart(grapharea, config);
}
