<template>
   <div class="relative overflow-x-auto shadow-md sm:rounded-lg just justify-center m-6">
      <table class="w-full text-sm text-center text-gray-500">
         <thead class="text-xs uppercase bg-gray-800 text-white">
            <tr>
               <th scope="col" class="px-6 py-3">
                  Periodo
                  <select name="filtroPeriodo" id="filtroPeriodo" v-model="filtroPeriodo" @change="actualizarFiltro()"
                     class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                     <option value="">SIN FILTRO</option>
                     <option v-for="item of numeros2" :key="item.periodo">{{ item }}</option>
                  </select>
               </th>
               <th scope="col" class="px-6 py-3">
                  Facultad
                  <select name="filtroFacultad" id="filtroFacultad" v-model="filtroFacultad"
                     @change="actualizarFiltro()" class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                     <option value="">SIN FILTRO</option>
                     <option v-for="item in facultadesUnicas" :key="item" :value="item">{{ item }}</option>
                  </select>
               </th>
               <th scope="col" class="px-6 py-3">
                  Programa
                  <select name="filtroPrograma" id="filtroPrograma" v-model="filtroPrograma"
                     @change="actualizarFiltro()" class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                     <option value="">SIN FILTRO</option>
                     <option v-for="item in programasUnicos" :key="item" :value="item">{{ item }}</option>
                  </select>
               </th>
               <th class="px-6 py-3 text-center mb-4">matricula</th>
             <th class="px-6 py-3 text-center mb-4">Hombre</th>
             <th class="px-6 py-3 text-center mb-4">Mujer</th>
             <th class="px-6 py-3 text-center mb-4">est 1</th>
             <th class="px-6 py-3 text-center mb-4">est 2</th>
             <th class="px-6 py-3 text-center mb-4">est 3</th>
             <th class="px-6 py-3 text-center mb-4">est 4</th>
             <th class="px-6 py-3 text-center mb-4">est 5</th>
             <th class="px-6 py-3 text-center mb-4">est 6</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="item in numeros" :key="item.id"
               class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
               <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ item.periodo }}
               </td>
               <td class="px-6 py-4 text-black bg-stone-200">
                  {{ item.facultad }}
               </td>
               <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ item.programa }}
               </td>
               <td class="px-6 py-4 text-black bg-stone-200">{{ item.total_matricula }}</td>
             <td class="px-6 py-4 font-medium text-white whitespace-nowrap bg-stone-800 sorting_1">{{ item.sexo_feme
                }}</td>
             <td class="px-6 py-4 text-black bg-stone-200">{{ item.sexo_masc }}
             </td>
             <td class="px-6 py-4 font-medium text-white whitespace-nowrap bg-stone-800 sorting_1">{{ item.estrato_1
                }}</td>
             <td class="px-6 py-4 text-black bg-stone-200">{{ item.estrato_2 }}</td>
             <td class="px-6 py-4 font-medium text-white whitespace-nowrap bg-stone-800 sorting_1">{{ item.estrato_3
                }}</td>
             <td class="px-6 py-4 text-black bg-stone-200">{{ item.estrato_4 }}
             </td>
             <td class="px-6 py-4 font-medium text-white whitespace-nowrap bg-stone-800 sorting_1">{{ item.estrato_5
                }}</td>
             <td class="px-6 py-4 text-black bg-stone-200">{{ item.estrato_6 }}</td>   
            </tr>
         </tbody>
      </table>
   </div>


</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const filtroPeriodo = ref("");
const filtroFacultad = ref("");
const filtroPrograma = ref("");
const datosCompletos = ref([]); // Almacenar todos los datos aquí
const numeros = ref([]);
const numeros2 = ref([]);
const facultadesUnicas = ref([]);
const programasUnicos = ref([]);

// Esta función obtiene los datos iniciales y los periodos únicos
function obtenerDatos() {
   axios
      .get('https://www.datos.gov.co/resource/r86y-229a.json')
      .then((response) => {
         const periodosUnicos = new Set();
         const facultadesSet = new Set();
         const programasSet = new Set();

         response.data.forEach(element => {
            periodosUnicos.add(element.periodo);
            facultadesSet.add(element.facultad);
            programasSet.add(element.programa);
         });

         numeros2.value = [...periodosUnicos];
         facultadesUnicas.value = [...facultadesSet];
         programasUnicos.value = [...programasSet];
         datosCompletos.value = response.data; // Guardar los datos completos aquí
         numeros.value = response.data; // Inicializar numeros con todos los datos
      })
      .catch((error) => {
         console.error('Error al consultar los datos:', error);
      });
}

// Llamar a obtenerDatos al inicio para cargar los datos
obtenerDatos();

// Esta función se ejecutará cada vez que cambie el valor de los filtros
function actualizarFiltro() {
   let filteredData = datosCompletos.value;

   if (filtroPeriodo.value) {
      filteredData = filteredData.filter(item => item.periodo === filtroPeriodo.value);
   }
   if (filtroFacultad.value) {
      filteredData = filteredData.filter(item => item.facultad === filtroFacultad.value);
   }
   if (filtroPrograma.value) {
      filteredData = filteredData.filter(item => item.programa === filtroPrograma.value);
   }

   numeros.value = filteredData;
}

// Observar cambios en los filtros y actualizar la tabla
watch([filtroPeriodo, filtroFacultad, filtroPrograma], actualizarFiltro);
</script>

<script>

export default {

}

</script>

<style></style>