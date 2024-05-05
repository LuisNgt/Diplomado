import { createRouter, createWebHistory } from "vue-router"

/*import DashB from '../components/DashB.vue'*/
import ActividadOne from '@/pages/Actividad_1'
import ActividadTwo from '@/pages/Actividad_2'

   const routes = [

     /*{
        name: 'Dashboard',
        path: '/',
        component: DashB
     },*/
     {
         name: 'ActividadOne',
         path: '/actividad_1',
         component: ActividadOne
     },
     {
         name: 'ActividadTwo',
         path: '/actividad_2',
         component: ActividadTwo
     }

  ];
  const router = Router();
  export default router;
  function Router() {
    const router = new createRouter({
        history: createWebHistory(),
        routes,
    });
        return router;
  }