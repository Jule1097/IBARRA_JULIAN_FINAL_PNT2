import axios from 'axios';

export class CotizacionService {
    #url = '';

    constructor() {
        this.#url = 'https://api.bluelytics.com.ar/v2/latest';
    }

    getCotizacionDolar = async () => { 
        try {
            const cotizacion = await axios.get(this.#url);
            return cotizacion.data.oficial.value_sell;
        } catch (error) {   
            console.error('Error al obtener la cotización del dólar:', error);
        }
    }

}