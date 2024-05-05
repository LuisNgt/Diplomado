<template>
   <div class="h-full w-full ml-5 mr-5">
      <div class="flex justify-center">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col py-4 w-96">
               <label for="periodo" class="block mb-2 text-sm font-medium text-gray-900">Selecciona un periodo</label>
               <select id="periodo" v-model="periodoSeleccionado" @change="filtrarYCrearGrafico"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">SIN FILTRO</option>
                  <option v-for="periodo in periodosUnicos" :key="periodo" :value="periodo">
                     {{ periodo }}
                  </option>
               </select>
            </div>
            <div class="flex flex-col w-96">
               <label for="genero" class="block mt-4 mb-2 text-sm font-medium text-gray-900">Selecciona un
                  género</label>
               <select id="genero" v-model="generoSeleccionado" @change="filtrarYCrearGrafico"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">SIN FILTRO</option>
                  <option value="total">Total Matriculados</option>
                  <option value="hombre">Hombres</option>
                  <option value="mujer">Mujeres</option>
               </select>
            </div>
         </div>
      </div>


      <div class="w-full h-full">
         <canvas id="myChart"></canvas>
      </div>
   </div>



</template>


<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
   setup() {
      const numeros = ref([]);
      const totalesPorPrograma = ref({});
      const periodosUnicos = ref([]);
      //let generosUnicos = ['total', 'hombre', 'mujer'];
      const periodoSeleccionado = ref('');
      const generoSeleccionado = ref('');
      let miGrafico; // Variable global para mantener la referencia al gráfico

      // Función para calcular el total de matriculados por programa y género
      const calcularTotalesPorProgramaYGenero = (data, genero) => {
         return data.reduce((acc, curr) => {
            const { programa, sexo_masc, sexo_feme, total_matricula } = curr;
            if (!acc[programa]) {
               acc[programa] = 0;
            }
            const cantidad = genero === 'hombre' ? sexo_masc :
               genero === 'mujer' ? sexo_feme :
                  total_matricula;
            acc[programa] += parseInt(cantidad, 10);
            return acc;
         }, {});
      };

      // Función para filtrar los datos por el periodo y género seleccionados y crear el gráfico
      const filtrarYCrearGrafico = () => {
         let datosFiltrados = numeros.value;
         if (periodoSeleccionado.value) {
            datosFiltrados = datosFiltrados.filter((item) => item.periodo === periodoSeleccionado.value);
         }
         if (generoSeleccionado.value) {
            totalesPorPrograma.value = calcularTotalesPorProgramaYGenero(datosFiltrados, generoSeleccionado.value);
         } else {
            totalesPorPrograma.value = calcularTotalesPorProgramaYGenero(datosFiltrados, 'total');
         }
         crearGrafico();
      };

      // Función para crear el gráfico
      const crearGrafico = () => {
         const ctx = document.getElementById('myChart').getContext('2d');
         const labels = Object.keys(totalesPorPrograma.value);
         const data = Object.values(totalesPorPrograma.value);

         if (miGrafico) {
            miGrafico.destroy(); // Destruye la instancia anterior si existe
         }

         miGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
               labels: labels,
               datasets: [{
                  label: `Total Matriculados por Programa - ${generoSeleccionado.value || 'todos'}`, data: data,
                  backgroundColor: 'rgba(0, 123, 255, 0.5)',
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 1
               }]
            },
            options: {
               scales: {
                  y: {
                     beginAtZero: true
                  }
               }
            }
         });
      };

      // Función para obtener los datos, calcular los totales y obtener los periodos únicos
      const obtenerYCalcularTotales = () => {
         axios.get('https://www.datos.gov.co/resource/r86y-229a.json')
            .then((response) => {
               numeros.value = response.data;
               periodosUnicos.value = [...new Set(numeros.value.map(item => item.periodo))];
               periodoSeleccionado.value = ''; // Establece el periodo seleccionado por defecto como vacío
               generoSeleccionado.value = ''; // Establece el género seleccionado por defecto como vacío
               filtrarYCrearGrafico(); // Llama a filtrarYCrearGrafico aquí después de establecer periodosUnicos y generoSeleccionado
            })
            .catch((error) => {
               console.error('Error al consultar los datos:', error);
            });
      };

      onMounted(obtenerYCalcularTotales);

      return {
         numeros,
         totalesPorPrograma,
         periodosUnicos,
         generoSeleccionado,
         periodoSeleccionado,
         obtenerYCalcularTotales,
         filtrarYCrearGrafico,
         crearGrafico
      };
   }
};
</script>