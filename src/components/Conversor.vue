<template>
    <div class="container-fluid my-3 border-bottom pb-3">
        <h1>Conversor a dólares</h1>
    </div>
    <div class="container-fluid mt-3 " id="app">
        <div class="d-flex align-items-center">
            <p class="mb-0 me-3">Ingrese monto $</p>
            <input type="number" min="0" class="form-control" id="entradaMontos"
                @input="formDirty.montoPesos = true" v-model="formData.montoPesos"
                placeholder="Ingresa un monto en pesos...">
            </div>
            <div v-if="!validarMontoPesos() && formDirty.montoPesos" class="text-danger">
                {{ validacionConversor.mensajePesos }}
            </div>
    </div>
    <div class="container-fluid mt-3 " id="app">
        <div class="d-flex align-items-center">
            <p class="mb-0 me-3">Valor del dolar en $</p>
            <input type="number" class="form-control" id="entradaMontos" @input="formDirty.valorDolar = true"
                v-model="formData.valorDolar" placeholder="Ingresa el valor de la cotización del dolar..." :disabled="actualizacion">
            <input type="checkbox" id="actualizacion" class ="mx-3" v-model="actualizacion" > Actualización
            <span v-if="actualizacion && ultimaActualizacion" class="ms-3 text-muted fw-bold">Última actualización: {{ ultimaActualizacion }}</span>
            </div>
            <div v-if="!validarValorDolar() && formDirty.valorDolar" class="text-danger">
                {{ validacionConversor.mensajeDolar }}
            </div>
    </div>
    <div class=" container-fluid mt-3">
        <div class="d-flex align-items-center">
            <span class="me-3">Valor convertido USD</span>
            <p class="mb-0 fw-semibold">{{ convertirADolar.valorConvertido }}</p>
        </div>
    </div>
    <div id="respuestas">
        Respuestas:
        <ul>
            <li>1- C+F</li>
            <li>2- B</li>
            <li>3- C</li>
            <li>4- A</li>
            <li>5- B</li>
        </ul>
    </div>
</template>

<script>
import { CotizacionService } from '../services/Cotizacion.js';


export default {
    name: 'Conversor',
    data() {
        return {
            formData: {
                montoPesos: '',
                valorDolar: '',
                valorConvertido: ''
            },
            formDirty: this.getFormDataInicial(),
            cotizacionService: new CotizacionService(),
            cotizacionAPI: '',
            actualizacion: false,
            intervalId: null,
            ultimaActualizacion: null
        }
    },
    methods: {
        getFormDataInicial() {
            return {
                montoPesos: false,
                valorDolar: false,
                valorConvertido: false
            }
        },

        validarMontoPesos() {
            const monto = parseFloat(this.formData.montoPesos);
            return !isNaN(monto) && monto > 0;
        },
        validarValorDolar() {
            const valor = parseFloat(this.formData.valorDolar);
            return !isNaN(valor) && valor > 0;
        },
        puedeConvertir() {
            return !this.validacionConversor.ok;
        },

        async solicitarCotizacion() {
            this.cotizacionAPI = await this.cotizacionService.getCotizacionDolar();
            this.ultimaActualizacion = new Date().toLocaleString();
            if (this.actualizacion) {
                this.formData.valorDolar = this.cotizacionAPI;
            }
        },

        startInterval() {
            this.intervalId = setInterval(() => {
                this.solicitarCotizacion();
            }, 2000);
        },

        stopInterval() {
            if(this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    },
    computed: {
        convertirADolar() {
            if (this.validacionConversor.ok) {
                const pesos = parseFloat(this.formData.montoPesos);
                const dolar = parseFloat(this.formData.valorDolar);
                this.formData.valorConvertido = (pesos / dolar).toFixed(2);
            } else {
                this.formData.valorConvertido = '';
            }

            return {
                valorConvertido: this.formData.valorConvertido
            }
        },

        validacionConversor() {
            let mensajePesos = '';
            if (!this.validarMontoPesos()) {
                mensajePesos = 'El monto en pesos es obligatorio y debe ser un número positivo mayor a 0.\n';
            }

            let mensajeDolar = '';
            if (!this.validarValorDolar()) {
                mensajeDolar = 'El valor del dolar es obligatorio y debe ser un número positivo mayor a 0.\n';
            }

            return {
                mensajePesos,
                mensajeDolar,
                ok: mensajePesos.length === 0 && mensajeDolar.length === 0
            }
        }
    },
    watch:{
        actualizacion(nuevoValor) {
            if(nuevoValor) {
                this.solicitarCotizacion();
                this.startInterval();
            } else {
                this.stopInterval();
            }
        }
    },
    mounted() {
        this.solicitarCotizacion();
    },
    beforeUnmount() {
        this.stopInterval();
    }
}
</script>

<style>
#respuestas {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-weight: bolder;
}

#entradaMontos {
    width: 700px;
}
</style>